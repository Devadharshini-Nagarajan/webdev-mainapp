### Date Aggregation and Secure Interconnection System                                                                                       	  
- Developed a robust system that aggregates data from multiple entities, ensures secure intercompany communication,
and provides a user-friendly interface using ReactJS and Spring MVC.
Utilized Spring Boot,Discovery Server, Spring REST, Spring JPA, and a SQL, MongoDB database for efficient data management. 

<img width="1440" alt="image" src="https://github.com/Devadharshini-Nagarajan/webdev-mainapp/assets/113491692/b21b097a-e721-4b6c-b9f7-663b0be482a6">

### Architecture

<img width="514" alt="image" src="https://github.com/Devadharshini-Nagarajan/webdev-springboot-all/assets/113491692/46e75814-887a-4e86-9e5e-2271f72df3dd">

<img width="491" alt="image" src="https://github.com/Devadharshini-Nagarajan/webdev-springboot-all/assets/113491692/999bd600-2f4e-4df1-939e-47e5cd8c6f9c">

### Use Cases

## Company #N
**Admin Role**
- View Managers
- Add Managers

**Manager Role**
- CRUD Operations for data

## Aggregator
**Guest User / Registered User**
- Display Aggregated information to a user, which is retrieved from various companies and/or 3rd party API (weather)

**Admin**
- View Reports
- View Usage (Transaction done via system)

## Architecture

- Secure while accessing REST API
- Aggregator will communicate to all companies available
- Companies can talk to each other via a secure mechanism.
- Backed End: Controller <-> Service <-> Repository <-> Entity
- Front End: ReactJS / Spring MVC
