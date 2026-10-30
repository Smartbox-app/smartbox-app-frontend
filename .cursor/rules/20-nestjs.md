# NestJS Engineering Rules

## Architecture

Organize the application around feature/domain modules.

Prefer:

```text
users/
  users.module.ts
  users.controller.ts
  users.service.ts
  dto/
  entities/
```

over organizing the entire application by technical type:

```text
controllers/
services/
repositories/
dto/
```

Feature modules should encapsulate closely related functionality and expose a clear public API.

---

## Modules

A module should represent a meaningful application boundary.

A module should expose only what other modules actually need.

Prefer:

```ts
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

Do not export every provider by default.

Do not make modules global unless there is a strong architectural reason.

When another module needs functionality:

1. Export the required provider from its owning module.
2. Import the owning module where it is needed.
3. Do not duplicate the provider.

---

## Controllers

Controllers are HTTP/API adapters.

Their responsibilities are to:

* receive requests
* map request data into DTOs
* delegate work to application/domain services
* return results

Controllers should NOT contain:

* business logic
* database queries
* complex transformations
* external API implementations
* reusable domain logic
* substantial validation beyond request-level validation

Prefer:

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

over:

```ts
@Post()
async create(@Body() dto: CreateUserDto) {
  // validation
  // database query
  // password hashing
  // external API call
  // event publishing
  // response mapping
}
```

A controller should generally be thin.

---

## Controller Size

Keep controller methods small.

Ideally:

* controller methods <= 20 lines
* controllers should primarily delegate
* complex logic should live outside the controller

If a controller method grows beyond this, first determine whether responsibility should move to:

* a service
* a domain function
* a dedicated provider
* a pipe
* a guard
* an interceptor

Do not extract meaningless wrapper methods simply to reduce line count.

---

## Services

Services/providers contain application behavior.

A service should have one coherent responsibility.

Avoid a large service such as:

```text
UserService
  - users
  - billing
  - emails
  - permissions
  - files
  - analytics
```

Prefer focused services:

```text
UsersService
BillingService
PermissionsService
EmailService
AnalyticsService
```

A service may orchestrate other services when that orchestration belongs to its domain.

---

## Single Responsibility

Apply single responsibility to providers.

The goal is not:

> One method per class.

The goal is:

> One coherent reason for the provider to change.

Avoid:

```ts
@Injectable()
export class UsersService {
  createUser() {}
  sendWelcomeEmail() {}
  chargeCustomer() {}
  generateInvoice() {}
  exportUsers() {}
}
```

Separate unrelated responsibilities into focused providers/services.

---

## DTOs

Use DTOs at API boundaries.

DTOs should describe request/response contracts.

Prefer:

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

Avoid passing raw request objects deep into the application:

```ts
// Avoid
this.usersService.create(req.body);
```

Validate external input at the system boundary.

DTOs should not contain business logic.

---

## Pipes

Use pipes for:

* validation
* transformation
* parsing request input

Do not move business logic into pipes.

A pipe should answer questions such as:

> Is this request parameter valid?

or:

> How should this external value be transformed?

It should not answer business questions such as:

> Is this user allowed to perform this operation?

That belongs elsewhere.

---

## Guards

Use guards for access decisions.

A guard answers:

> Is this request allowed to execute this handler?

Examples:

* authentication
* authorization
* roles
* permissions
* feature access

Do not use guards for business operations.

Keep authorization logic focused on access decisions rather than performing the actual operation.

---

## Interceptors

Use interceptors for cross-cutting behavior.

Good use cases:

* logging
* response transformation
* timing
* caching
* metrics
* instrumentation

Do not put core business logic in interceptors.

---

## Middleware

Use middleware for request-level concerns that do not need knowledge of the route handler.

Examples:

* request IDs
* raw request preprocessing
* generic request logging
* low-level HTTP concerns

If logic needs to know which handler or route is being executed, consider a guard or interceptor instead.

---

## Request Lifecycle

Keep responsibilities aligned with NestJS's request lifecycle:

```text
Middleware
    ↓
Guards
    ↓
Interceptors
    ↓
Pipes
    ↓
Controller
    ↓
Service / Provider
    ↓
Repository / External Provider
```

Do not move logic into an earlier lifecycle stage merely because it is technically possible.

Use the NestJS mechanism that naturally owns the responsibility.

---

## Business Logic

Business rules belong in application/domain services or focused domain functions, not controllers.

Avoid:

```ts
if (
  user.subscription === 'PRO' &&
  user.paymentStatus === 'PAID'
) {
  // ...
}
```

inside a controller.

Prefer:

```ts
return this.subscriptionService.canAccessFeature(
  user,
  feature,
);
```

Business rules should be independently testable.

---

## Database Access

Do not perform database queries directly from controllers.

Prefer:

```text
Controller
    ↓
Service
    ↓
Repository / ORM
    ↓
Database
```

Database-specific implementation should remain behind an appropriate boundary when that improves separation.

Do not create repository abstractions purely because a pattern says you should.

If the ORM/repository API already provides an appropriate abstraction and adding another layer adds no value, keep the code simpler.

---

## External APIs

Do not call third-party APIs directly from controllers.

Prefer a dedicated provider/service:

```text
Controller
    ↓
Application Service
    ↓
StripeService / MailService / SomeApiService
    ↓
External API
```

Keep third-party-specific implementation inside the integration provider.

This makes external integrations easier to test and replace.

---

## Dependency Injection

Prefer NestJS dependency injection over manually instantiating providers.

Avoid:

```ts
const service = new UsersService();
```

inside application code.

Prefer:

```ts
constructor(
  private readonly usersService: UsersService,
) {}
```

Use dependency injection consistently so Nest controls the dependency graph and providers remain testable.

---

## Provider Visibility

Keep providers private to their module unless another module genuinely needs them.

If another module needs a provider:

1. Export it from its owning module.
2. Import the owning module.
3. Inject the provider normally.

Avoid global providers unless they are genuinely application-wide infrastructure.

---

## Async Code

Use `async/await` for sequential asynchronous operations.

Avoid unnecessary `await`:

```ts
return await this.service.create(dto);
```

when this is equivalent:

```ts
return this.service.create(dto);
```

Use `await` when:

* the result is required
* execution must be sequential
* an error needs to be caught or transformed
* cleanup/finalization depends on completion
* the Promise result is otherwise needed

Prefer Promise composition where it makes the code clearer.

---

## Error Handling

Use NestJS's exception system consistently.

Throw appropriate exceptions from the appropriate layer.

Avoid:

```ts
return {
  success: false,
  error: 'Something went wrong',
};
```

when the application expects HTTP exceptions.

Do not catch an exception unless you are:

* handling it
* translating it
* adding useful context
* recovering from it
* intentionally changing its behavior

Avoid:

```ts
try {
  await operation();
} catch (error) {
  throw error;
}
```

unless there is a meaningful reason to catch it.

Never silently swallow exceptions.

---

## Business Errors vs HTTP Errors

Keep HTTP concerns out of domain logic when practical.

A domain/application operation should not need to know that its caller happens to be HTTP.

Prefer translating domain/application failures into HTTP exceptions at the API boundary when appropriate.

This keeps business logic reusable outside HTTP controllers.

---

## Validation

Validate external input as early as practical.

Typical flow:

```text
HTTP Request
    ↓
DTO
    ↓
Validation Pipe
    ↓
Controller
    ↓
Application Service
```

Do not rely on database constraints or business services as the primary mechanism for validating malformed external input.

Database constraints should still exist for data integrity.

---

## Transactions

Use transactions when multiple database operations must succeed or fail together.

Keep transaction boundaries explicit.

Do not create transactions around every database operation by default.

A transaction should correspond to a meaningful atomic business operation.

---

## Naming

Use descriptive names.

Prefer:

```ts
createSubscription()
cancelSubscription()
calculateInvoiceTotal()
findActiveUsers()
```

over:

```ts
process()
handle()
execute()
doSomething()
```

unless the generic name is meaningful within a very narrow abstraction.

Avoid generic provider names such as:

```text
CommonService
HelperService
UtilsService
GeneralService
BaseService
```

when they contain unrelated responsibilities.

---

## File and Class Size

Do not enforce arbitrary hard limits on NestJS classes.

Use responsibility as the primary signal.

Split a class when:

* it has multiple unrelated responsibilities
* methods have different reasons to change
* dependencies become excessive
* testing becomes difficult
* the class represents multiple domains
* the class becomes difficult to understand

As a guideline, keep individual methods around 20 lines where practical.

Do not split code solely to satisfy a line count.

---

## Testing

Test business behavior at the service/domain level.

### Controller tests

Focus on:

* request mapping
* response mapping
* HTTP-specific behavior
* interaction with providers

### Service tests

Focus on:

* business rules
* edge cases
* failures
* state transitions
* orchestration

Do not mock everything by default.

Mock external boundaries when integration with the actual dependency is inappropriate for the test.

---

## Avoid Generic Abstractions

Do not create abstractions merely to follow a pattern.

Avoid unnecessary:

```text
BaseService
BaseRepository
BaseController
GenericRepository
CommonService
UtilsService
```

unless the abstraction represents a real, shared behavior.

Prefer concrete, domain-focused code until a meaningful abstraction emerges.

---

## NestJS Anti-Patterns

Avoid:

* fat controllers
* god services
* database queries in controllers
* business logic in DTOs
* business logic in guards
* business logic in interceptors
* making every provider global
* exporting every provider
* unnecessary repository abstractions
* manually instantiating injectable providers
* catching and swallowing exceptions
* generic `CommonService` / `UtilsService` classes
* unrelated functionality in the same module
* unnecessary layers that only delegate without adding value

Prefer small feature modules with clear boundaries, focused providers, and explicit dependencies.
