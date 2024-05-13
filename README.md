# Sample Taks Manager App

## Stack
Java, SpringBoot, Angular, Keycloak

## Projects
* `api` - REST API secured as resource server using **spring-boot-starter-oauth2-resource-server** it checks for `access_to_task_api` scope (cleint must have it for access)
* `ui` - Angular SPA secured using **angular-oauth2-oidc**

## OAuth2 Flows
* PKCE Authorization Code Flow - `ui` app

## Keycloak TaskManagement Realm
* Exported in `task-management-realm-export.json`
* Realm name: `TaskManagement`
* Test users: 
    - myuser1/Welcome1 
    - myuser2/Welcome1
    - random1/Welcome1
* Groups: `TaskGroup` (myuser1 and myuser2)
* Roles: `task_app_role` (TaskGroup mapped to this role)    
* Scope: `access_to_task_api` (task_app_role has this scope) 
* Clients:
    - UserTaskUI: public client (public access type), used for `ui`app

## App implements user stories
As a user, I want to log in to my account securely using my email and password.
As a user, I want to view a dashboard displaying all my tasks.
As a user, I want to create a new task with a title, description, due date, and priority.
As a user, I want to view the details of a specific task, including its title, description, due date, priority, and status.
As a user, I want to update the details of a task, such as its title, description, due date, and priority.
As a user, I want to mark a task as completed once I've finished it.
As a user, I want to delete a task that I no longer need.
As a user, I want to filter tasks based on their status (e.g., completed, pending).
As a user, I want to sort tasks based on their due date or priority.
As a user, I want to be able to log out of my account securely.
  
