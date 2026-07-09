# Architecture Diagrams

This file contains portfolio-friendly architecture diagrams for the Nest E-Commerce API. GitHub can render the Mermaid diagrams directly, and the diagrams can also be copied into portfolio pages, Notion, or Markdown-based resumes.

## System Context

```mermaid
flowchart TB
    User[API Consumer / Frontend] -->|HTTP JSON| Nest[NestJS E-Commerce API]
    User -->|multipart/form-data| UploadRoute[Upload Endpoint]

    Nest --> Swagger[Swagger OpenAPI Docs at /api]
    Nest --> Validation[Global ValidationPipe]
    Nest --> Serializer[DTO Response Transformer]

    Nest --> Auth[Auth and User Modules]
    Nest --> Catalog[Category, Product, Gallery, Variant Modules]
    Nest --> Access[Role, Endpoint, Permission Modules]
    UploadRoute --> Multer[Multer Disk Storage]

    Auth --> JWT[JWT Signing and Verification]
    Auth --> Hashing[bcrypt Password Hashing]
    Catalog --> Slugs[Automatic Slug Generation]
    Access --> Discovery[Bootstrap Route Discovery]

    Auth --> Database[(PostgreSQL)]
    Catalog --> Database
    Access --> Database
    Multer --> LocalFiles[uploads/products]
```

## Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller as Nest Controller
    participant Validation as ValidationPipe
    participant Guard as AuthGuard
    participant Service
    participant Repo as TypeORM Repository
    participant DB as PostgreSQL

    Client->>Controller: HTTP request
    Controller->>Validation: Validate DTO inputs
    alt Protected route
        Controller->>Guard: Verify Bearer token
        Guard->>Guard: Decode JWT and attach currentUser
    end
    Controller->>Service: Call business operation
    Service->>Repo: Query or persist entity
    Repo->>DB: SQL operation
    DB-->>Repo: Result
    Repo-->>Service: Entity / data
    Service-->>Controller: Response payload
    Controller-->>Client: JSON response
```

## Module Map

```mermaid
flowchart LR
    App[AppModule] --> Config[ConfigModule]
    App --> TypeORM[TypeOrmModule]
    App --> Auth[AuthModule]
    App --> User[UserModule]
    App --> Role[RoleModule]
    App --> Endpoint[EndpointModule]
    App --> Permission[PermissionsModule]
    App --> Category[CategoryModule]
    App --> Product[ProductModule]
    App --> Gallery[ProductGalleriesModule]
    App --> Variant[VariantsModule]
    App --> Upload[UploadModule]

    Auth --> User
    Auth --> Role
    User --> Role
    Permission --> Role
    Permission --> Endpoint
    Product --> Category
    Product --> Gallery
    Product --> Variant
```

## Entity Relationship Diagram

```mermaid
erDiagram
    ROLE ||--o{ USER : has
    ROLE ||--o{ PERMISSION : grants
    ENDPOINT ||--o{ PERMISSION : maps_to
    CATEGORY ||--o{ PRODUCT : contains
    CATEGORY ||--o{ CATEGORY : parent_child
    PRODUCT ||--o{ PRODUCT_GALLERY : displays
    PRODUCT ||--o{ VARIANT : offers

    ROLE {
      string name PK
      string description
      boolean isActive
    }

    USER {
      number id PK
      string firstName
      string lastName
      string email
      string password
      boolean isActive
    }

    ENDPOINT {
      number id PK
      string url
      string method
    }

    PERMISSION {
      string roleName PK
      string endpointId PK
      boolean isAllow
    }

    CATEGORY {
      number id PK
      string name
      string description
      string slug
      boolean isActive
      date deletedDate
    }

    PRODUCT {
      number id PK
      string name
      string image
      number price
      number offerPrice
      string shortDescription
      string longDescription
      number quantity
      string slug
      date deletedDate
    }

    PRODUCT_GALLERY {
      number id PK
      string image
    }

    VARIANT {
      number id PK
      string name
    }
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant AuthService
    participant UserService
    participant RoleService
    participant JWT
    participant DB as PostgreSQL

    Client->>AuthController: POST /api/v1/auth/sign-up
    AuthController->>AuthService: signUp(dto)
    AuthService->>UserService: create(dto)
    UserService->>RoleService: getRole("user")
    RoleService->>DB: Find default role
    UserService->>UserService: Hash password with bcrypt
    UserService->>DB: Save user
    AuthService->>JWT: Sign access token
    AuthController-->>Client: Access token
```

## Portfolio Explanation

Use this short explanation beside the diagram:

> The backend uses a modular NestJS architecture where each business area owns its controller, service, DTOs, and TypeORM entity. Requests enter through REST controllers, pass through validation and optional JWT guards, execute domain logic in services, and persist data through TypeORM repositories. At startup, the application discovers registered HTTP routes and stores them as endpoint records, which supports role-to-endpoint permission mapping.

## Production Improvement Checklist

- Replace `synchronize: true` with TypeORM migrations.
- Move database credentials from `src/app.module.ts` into environment variables.
- Add a role-based permission guard that checks the `Permission` table before controller execution.
- Store uploads in object storage such as S3, Cloudinary, or Supabase Storage.
- Add pagination, filtering, and sorting for product and category list endpoints.
- Add unique constraints for user email, product slug, and category slug.
- Add integration tests for auth, catalog, and permission workflows.
