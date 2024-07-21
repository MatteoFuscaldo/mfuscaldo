# Wrangling Data Like a Boss: Simplifying Transformations with Arrays of Structs

2024-06-16

**Turning the Tables on Complex Joins**

Let's say you have a table of users and another table recording their login activities. You want to find users who logged in more than twice in the past week. Here's how you might tackle it with a traditional join:

```sql
SELECT u.username, COUNT(l.login_time) AS login_count
FROM users u
INNER JOIN logins l ON u.user_id = l.user_id
WHERE l.login_time > CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY u.username
HAVING login_count > 2;
```

Not the most elegant solution, right? Now, imagine if each user could have an array containing their login activities. Our query transforms into something much cleaner:

```sql
SELECT username, 
       size(filter(logins, login_time > CURRENT_TIMESTAMP - INTERVAL '7 days')) AS recent_logins
FROM users 
WHERE size(logins) > 2;
```

**The Power of Arrays**

This approach not only simplifies joins but also unlocks the power of functions like `filter()`. We can easily filter the login array within the user record itself, keeping the logic concise and efficient.

**But Wait, There's More!**

Arrays of structs offer even more benefits. Imagine a user object with an array containing not just timestamps, but also login locations. You could then filter or analyze login patterns based on location within the same query. Talk about flexibility!

**So, When Should You Use This Trick?**

This approach shines when dealing with one-to-many relationships, especially when you need to perform aggregations or filtering on the "many" side. It's also a great choice for data with inherent hierarchical structures.

**The Takeaway**

Don't be afraid to break away from traditional join structures. Arrays of structs can be your secret weapon for simplifying complex transformations and keeping your code clean and maintainable. So, the next time you're wrestling with messy data, remember: there's a whole new world of possibilities within those curly braces!
