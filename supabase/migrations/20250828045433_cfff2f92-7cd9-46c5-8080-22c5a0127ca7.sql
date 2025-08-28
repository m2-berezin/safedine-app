-- Update some past orders to completed status so users can leave reviews
UPDATE orders 
SET status = 'completed' 
WHERE created_at < NOW() - INTERVAL '1 hour';