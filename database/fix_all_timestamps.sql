

BEGIN;


UPDATE trips
SET 
    created_at = TIMESTAMP '2024-01-01' + (RANDOM() * (NOW() - TIMESTAMP '2024-01-01')),
    updated_at = LEAST(
        created_at + (RANDOM() * INTERVAL '30 days'),
        NOW()
    );

-- ============================================
-- ตาราง users
-- ============================================

-- แก้ไข created_at ให้เป็นเวลาสุ่มทั้งหมด
-- สุ่มในช่วงปี 2024 ถึงวันนี้
UPDATE users
SET created_at = TIMESTAMP '2024-01-01' + (RANDOM() * (NOW() - TIMESTAMP '2024-01-01'));

-- ============================================
-- ตรวจสอบผลลัพธ์
-- ============================================

-- ดูข้อมูล trips
SELECT 
    id, 
    title, 
    created_at, 
    updated_at,
    CASE 
        WHEN created_at = updated_at THEN '⚠️ ยังเหมือนกัน'
        ELSE '✅ ถูกต้อง'
    END as status
FROM trips 
ORDER BY id;

-- ดูข้อมูล users
SELECT 
    id, 
    email, 
    created_at
FROM users 
ORDER BY id;

-- นับจำนวนแถวที่มีปัญหา
SELECT 
    'trips' as table_name,
    COUNT(*) as rows_with_same_timestamps
FROM trips 
WHERE created_at = updated_at
UNION ALL
SELECT 
    'users' as table_name,
    COUNT(*) as rows_with_null_timestamps
FROM users 
WHERE created_at IS NULL;

COMMIT;

