Requirement:
1. create one web site for quiz competation with login and registration
2. Once user sign up/in, redirect to the home screen
3. play one vedio, the vedio should get from database and ask one quiz question
4. in the background timer should from from 1 sec - nano sec.
5. we need to store only the first 10 users data in db, but display in asc order based on the timer.
6. Once user submits the quiz. Store the user details along with timer in db. Show one alert to the user with thank you note and all the submitted user details with timer.
  


Changes:
1. instead of timer run from 1sec to nano sec, im running the timer from 60 sec to 0 sec. because timer from 1 sec-nano is not possible in real time.
2. Vedio not fetching from db, stored in local inside public playing that.



Summary:

1.using mysql databse for storing data.
2. created login, registration and home page.
3. added validation when user submits the quiz.
4. 
