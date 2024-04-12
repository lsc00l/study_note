# SQL Query Cheat Sheet
## 테이블 정의서

```sql

SELECT   a.table_name
       , a.table_comment 
       , b.column_name 
       , b.column_comment
       , b.column_type
       , b.column_key 
       , b.IS_NULLABLE
FROM information_schema.TABLES a inner join information_schema.COLUMNS b on a.table_name = b.table_name 
WHERE a.table_schema='스키마명';

SELECT
   t1.table_name, t1.table_comment, column_comment, column_name, data_type, 
    case when is_nullable = 'NO' then 'X' ELSE '' END AS is_Nullable, 
    case when column_key = 'PRI' then 'O' ELSE '' END AS column_key,
    case when column_key = 'MUL' then 'O' ELSE '' END AS idx
    -- column_key, column_default, extra
FROM
   (SELECT
       table_name, table_comment
    FROM
       information_schema.TABLES WHERE table_schema='스키마명') t1,
   (SELECT
       table_name, column_name, data_type, column_type, column_key, is_nullable, column_default, extra, column_comment, ordinal_position
    FROM
       information_schema.COLUMNS WHERE table_schema='스키마명') t2
WHERE
    t1.table_name = t2.table_name
ORDER BY
    t1.table_name, ordinal_position;

SET @rownum:=0;

SELECT
   t1.table_name, 
   (CASE @val WHEN t1.table_name THEN @rownum:=@rownum+1 ELSE @rownum:=1 END) as rNum,
   
   
   t1.table_comment, 
   column_comment, 
   column_name, 
   data_type, 
   case when is_nullable = 'NO' then 'X' ELSE '' END AS is_Nullable, 
   case when column_key = 'PRI' then 'O' ELSE '' END AS column_key,
   case when column_key = 'MUL' then 'O' ELSE '' END AS idx,
    (@val:=t1.table_name) temp
   -- column_key, column_default, extra
FROM
   (SELECT
       table_name, table_comment
    FROM
       information_schema.TABLES WHERE table_schema='stcm') t1,
   (SELECT
       table_name, column_name, data_type, column_type, column_key, is_nullable, column_default, extra, column_comment, ordinal_position
    FROM
       information_schema.COLUMNS WHERE table_schema='stcm') t2
WHERE
    t1.table_name = t2.table_name
ORDER BY
    t1.table_name, ordinal_position;
```

- 엑셀 매크로 (sameCellMerge)
    
    테이블 정의서 만들 때 편함
    
    ```
    Sub SameCellMerge()
        Dim rngTarget As Range
        Dim rngCell As Range
        Dim strAddress As String
        Dim intNum As Long
        Dim intCount As Long
        Dim intTemp2 As Long
        Dim intTemp As Long
        Dim i As Integer
        Application.DisplayAlerts = False
        On Error GoTo ET
        Set rngTarget = Application.InputBox("대상 영역을 선택하세요", "영역 선택", Type:=8, Default:=strAddress)
        intNum = rngTarget.Cells.Count
      
        For Each rngCell In rngTarget
            intTemp = intTemp + 1
            intTemp2 = intNum - intTemp 
            If Len(rngCell) > 0 Then
                i = 0
                For intCount = 1 To intTemp2
                    If rngCell.Offset(intCount, 0) = rngCell Then
                        i = i + 1
                    Else
                        Exit For
                    End If
                Next intCount
                If i > 0 Then Range(rngCell, rngCell.Offset(i, 0)).Merge
              
            End If
        Next rngCell
        rngTarget.VerticalAlignment = xlCenter
        Application.DisplayAlerts = True
        Exit Sub
    ET:
        MsgBox "영역 선택이 잘못되었습니다. 영역을 다시 선택하세요!", , "에러 번호: " & Err.Number
    End Sub
    ```
    



# 날짜

### 날짜 리스트로 출력

```sql
SELECT CURDATE() - INTERVAL (a.a) DAY as date_list
FROM (SELECT 6 AS a UNION ALL SELECT 5 UNION ALL SELECT 4 UNION ALL SELECT 3 UNION ALL SELECT 2 UNION ALL SELECT 1 UNION ALL SELECT 0) AS a
```


### 일주일 출력

```sql
SELECT  ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 0 ) AS MONDAY,
        ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 1 ) AS TUESDAY,
        ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 2 ) AS WEDNESDAY,
        ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 3 ) AS THURSDAY,
        ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 4 ) AS FRIDAY,
        ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 5 ) AS SATURDAY,
        ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 6 ) AS SUNDAY;
```


### 이번주 날짜 리스트

```sql
-- 1번 

SELECT ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + a.a ) as week_list
FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) AS a
ORDER BY week_list

;

-- 2번 
SELECT ADDDATE( CURDATE(), - WEEKDAY(CURDATE()) + 0 ) AS week_list
    UNION ALL SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 1) 
    UNION ALL SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 2) 
    UNION ALL SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 3) 
    UNION ALL SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 4) 
    UNION ALL SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 5)
    UNION ALL SELECT ADDDATE(CURDATE(), - WEEKDAY(CURDATE()) + 6)

```

## 공통코드 함수

```sql
BEGIN
DECLARE RESULT VARCHAR(128) CHARSET utf8;
SELECT CODE_DESC INTO RESULT FROM DR_CODE_INFO WHERE CODE_LIST_ID = codetype AND CODE = codeid LIMIT 1;
RETURN RESULT;
END
```
