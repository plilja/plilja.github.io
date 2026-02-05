---
layout: post
title: SQL Server Substitute
tags: [databases]
---

The function for string substitution in Microsoft SQL Server is called `REPLACE`.

Use it by invoking `REPLACE(@yourString, @searchFor, @replaceWith);`.

For example:

```sql
SELECT REPLACE('This is a haystack', 'haystack', 'needle');
```

This would produce:

```text
This is a needle
(1 rows affected)
```

Since it's a function you can, for example, also use it in `where` clauses or in `update`
statements.

Example:

```sql
UPDATE 
   YourTable
SET
   YourColumn = REPLACE(YourColumn, 'foo', 'bar');
```

