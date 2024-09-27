Voting Application

- A functionality where user can give vote to the given set of candidate

models;
routes;

voting app Functionality
1. user sign in/up
2. see the list of candidate
3. vote one of the candidate, ensure the person vote only one time
4. live maximum count of voting show in particular routes
5. user login one unique government id proof : aadhar card and so on.
6. one admin to maintain the table of candidates and updation their field.
7. user change their password


--------------------------------------------------------------------------

Routes

User Authentication:
    /signup: POST - Create a new user account.
    /login: POST - Log in to an existing account. [ aadhar card number + password ]

Voting:
    /candidates: GET - Get the list of candidates.
    /vote/:candidateId: POST - Vote for a specific candidate.

Vote Counts:
    /vote/counts: GET - Get the list of candidates sorted by their vote counts.

User Profile:
    /profile: GET - Get the user's profile information.
    /profile/password: PUT - Change the user's password.

Admin Candidate Management:
    /candidates: POST - Create a new candidate.
    /candidates/:candidateId: PUT - Update an existing candidate.
    /candidates/:candidateId: DELETE - Delete a candidate from the list.
 