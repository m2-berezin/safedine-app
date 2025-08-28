import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Star, 
  Gift, 
  Award, 
  History, 
  Crown,
  Sparkles,
  TrendingUp,
  Coins
} from "lucide-react";

interface LoyaltyProfile {
  id: string;
  user_id: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  total_earned_points: number;
  tier_progress: number;
  created_at: string;
  updated_at: string;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  cost_points: number;
  reward_type: 'discount' | 'free_item' | 'points_multiplier';
  reward_value: number;
  is_active: boolean;
  min_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  created_at: string;
  updated_at: string;
}

interface LoyaltyTransaction {
  id: string;
  user_id: string;
  transaction_type: 'earned' | 'redeemed';
  points: number;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  reward_id: string | null;
  created_at: string;
}

interface LoyaltyProgramProps {
  userId: string;
}

export default function LoyaltyProgram({ userId }: LoyaltyProgramProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch loyalty profile
  const { data: loyaltyProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['loyalty-profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Create profile if it doesn't exist
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from('loyalty_profiles')
          .insert({
            user_id: userId,
            points: 0,
            tier: 'bronze',
            total_earned_points: 0,
            tier_progress: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        return newProfile;
      }

      return data;
    },
    enabled: !!userId
  });

  // Fetch available rewards
  const { data: rewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ['loyalty-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('is_active', true)
        .order('cost_points', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  // Fetch transaction history
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['loyalty-transactions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  // Redeem reward mutation
  const redeemRewardMutation = useMutation({
    mutationFn: async (reward: LoyaltyReward) => {
      if (!loyaltyProfile || loyaltyProfile.points < reward.cost_points) {
        throw new Error('Insufficient points');
      }

      // Create redemption record
      const { data: redemption, error: redemptionError } = await supabase
        .from('user_reward_redemptions')
        .insert({
          user_id: userId,
          reward_id: reward.id,
          points_spent: reward.cost_points,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .select()
        .single();

      if (redemptionError) throw redemptionError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('loyalty_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'redeemed',
          points: -reward.cost_points,
          description: `Redeemed: ${reward.name}`,
          reward_id: reward.id
        });

      if (transactionError) throw transactionError;

      // Update loyalty profile points
      const { error: updateError } = await supabase.rpc('update_loyalty_profile', {
        user_id_param: userId,
        points_change: -reward.cost_points
      });

      if (updateError) throw updateError;

      return redemption;
    },
    onSuccess: (_, reward) => {
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${reward.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ['loyalty-profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-transactions', userId] });
    },
    onError: (error) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to redeem reward",
        variant: "destructive"
      });
    }
  });

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Award className="h-5 w-5 text-amber-600" />;
      case 'silver': return <Star className="h-5 w-5 text-gray-400" />;
      case 'gold': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'platinum': return <Crown className="h-5 w-5 text-purple-500" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextTierThreshold = (tier: string) => {
    switch (tier) {
      case 'bronze': return 1000;
      case 'silver': return 2500;
      case 'gold': return 5000;
      default: return 5000;
    }
  };

  const getNextTierName = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'Silver';
      case 'silver': return 'Gold';
      case 'gold': return 'Platinum';
      default: return 'Platinum';
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Gift className="h-4 w-4" />;
      case 'free_item': return <Sparkles className="h-4 w-4" />;
      case 'points_multiplier': return <TrendingUp className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const formatRewardValue = (reward: LoyaltyReward) => {
    switch (reward.reward_type) {
      case 'discount':
        return `${reward.reward_value}% off`;
      case 'free_item':
        return 'Free item';
      case 'points_multiplier':
        return `${reward.reward_value}x points`;
      default:
        return '';
    }
  };

  const canRedeemReward = (reward: LoyaltyReward) => {
    if (!loyaltyProfile) return false;
    
    const tierOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
    const userTierLevel = tierOrder[loyaltyProfile.tier];
    const requiredTierLevel = tierOrder[reward.min_tier];
    
    return loyaltyProfile.points >= reward.cost_points && userTierLevel >= requiredTierLevel;
  };

  if (profileLoading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground animate-pulse-slow">Loading loyalty profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Loyalty Status Card */}
      <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-stagger-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary animate-pulse-slow" />
            Loyalty Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTierIcon(loyaltyProfile?.tier || 'bronze')}
              <div>
                <Badge className={`${getTierColor(loyaltyProfile?.tier || 'bronze')} animate-bounce-gentle`}>
                  {(loyaltyProfile?.tier || 'bronze').charAt(0).toUpperCase() + (loyaltyProfile?.tier || 'bronze').slice(1)} Member
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {loyaltyProfile?.total_earned_points || 0} total points earned
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary animate-fade-in-up">
                {loyaltyProfile?.points || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Available Points
              </div>
            </div>
          </div>

          {loyaltyProfile?.tier !== 'platinum' && (
            <div className="space-y-2 animate-stagger-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {getNextTierName(loyaltyProfile?.tier || 'bronze')}</span>
                <span>{loyaltyProfile?.total_earned_points || 0} / {getNextTierThreshold(loyaltyProfile?.tier || 'bronze')}</span>
              </div>
              <Progress 
                value={loyaltyProfile?.tier_progress || 0} 
                className="h-2 animate-fade-in" 
              />
              <p className="text-xs text-muted-foreground">
                {getNextTierThreshold(loyaltyProfile?.tier || 'bronze') - (loyaltyProfile?.total_earned_points || 0)} more points to next tier
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Rewards and History */}
      <Tabs defaultValue="rewards" className="animate-stagger-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="mt-6 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2">
            {rewardsLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-8 bg-muted rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              rewards?.map((reward) => (
                <Card 
                  key={reward.id} 
                  className={`hover:shadow-medium transition-all duration-200 hover:scale-[1.02] ${
                    !canRedeemReward(reward) ? 'opacity-60' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getRewardIcon(reward.reward_type)}
                        <h4 className="font-semibold">{reward.name}</h4>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {reward.cost_points} pts
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {reward.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        {formatRewardValue(reward)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => redeemRewardMutation.mutate(reward)}
                        disabled={!canRedeemReward(reward) || redeemRewardMutation.isPending}
                        className="hover:scale-105 transition-all duration-200 disabled:hover:scale-100"
                      >
                        {redeemRewardMutation.isPending ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                        ) : (
                          'Redeem'
                        )}
                      </Button>
                    </div>
                    
                    {!canRedeemReward(reward) && loyaltyProfile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {loyaltyProfile.points < reward.cost_points 
                          ? `Need ${reward.cost_points - loyaltyProfile.points} more points`
                          : `Requires ${reward.min_tier} tier or higher`
                        }
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Points History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted-foreground/20 rounded w-48"></div>
                        <div className="h-3 bg-muted-foreground/20 rounded w-24"></div>
                      </div>
                      <div className="h-4 bg-muted-foreground/20 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className={`flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-all duration-200 animate-stagger-${Math.min(index + 1, 4)}`}
                    >
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className={`font-semibold ${
                        transaction.transaction_type === 'earned' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'earned' ? '+' : '-'}{Math.abs(transaction.points)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50 animate-bounce-gentle" />
                  <p className="text-muted-foreground">No transaction history yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start ordering to earn your first points!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}