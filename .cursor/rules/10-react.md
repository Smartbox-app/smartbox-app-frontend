# React Engineering Rules

## Component Style

Use functional React components.

**Project convention: prefer arrow-function components.**

```tsx
const UserCard = ({ user }: UserCardProps) => (
  <Card>
    <UserName name={user.name} />
  </Card>
);
```

Do not use class components in new code unless a specific framework or library requirement makes them necessary.

---

## Component Props Types

When a component accepts props, define a specifically named props type using the component name.

The naming convention is:

```text
<ComponentName>Props
```

Example:

```ts
type UserCardProps = {
  user: User;
  onSelect: (user: User) => void;
};
```

Then:

```tsx
const UserCard = ({ user, onSelect }: UserCardProps) => {
  // ...
};
```

### Do not use generic `Props`

Avoid:

```ts
type Props = {
  user: User;
};
```

Prefer:

```ts
type UserCardProps = {
  user: User;
};
```

Examples:

```ts
type UserListProps = { ... };
type UserListItemProps = { ... };
type CreateUserFormProps = { ... };
type NavigationMenuProps = { ... };
```

This makes the type immediately identifiable in IDE tooling, imports, and error messages.

If a component does not accept props, do not create an empty props type.

Avoid:

```tsx
type UserCardProps = {};

const UserCard = ({}: UserCardProps) => ...
```

Prefer:

```tsx
const UserCard = () => ...
```

Export the props type when it is genuinely part of the component's public API or needs to be reused elsewhere.

---

## Single Responsibility

Every component should have one primary responsibility.

A component should generally do one of the following:

* render a specific piece of UI
* manage a specific piece of local UI state
* orchestrate other components

Avoid components that simultaneously:

* fetch data
* transform large amounts of data
* manage several unrelated states
* contain substantial business logic
* render large amounts of unrelated UI
* handle navigation
* perform unrelated side effects

Extract those responsibilities.

A useful test:

> Can the purpose of this component be described in one short sentence without using "and"?

If not, consider decomposing it.

---

## Component Size

Components should ideally be **20 lines or fewer**.

This is a guideline, not a hard limit.

When a component grows beyond approximately 20 lines, evaluate whether it should be decomposed.

Ask:

1. Is the component doing more than one thing?
2. Can state or behavior move into a custom hook?
3. Can a visual section become a child component?
4. Can complex calculations become pure functions?
5. Is this actually a page/container whose larger size is justified?

Do not split JSX mechanically just to satisfy the line count.

A 25-line component with one clear responsibility is preferable to five meaningless 5-line components.

---

## Pages and Containers

Pages and route-level components may be larger than normal presentational components.

A page is primarily an orchestration layer.

Example:

```tsx
const UsersPage = () => {
  const { users, isLoading } = useUsers();

  return (
    <Page>
      <PageHeader />
      <UserFilters />
      <UserList users={users} isLoading={isLoading} />
    </Page>
  );
};
```

The page coordinates the feature.

Child components should own their respective UI responsibilities.

Do not force pages to meet the 20-line guideline if doing so would make the architecture less clear.

---

## Delegating Logic

When logic needs to be extracted from a component, prefer a **custom hook** when the logic is related to React or component behavior.

Use a custom hook when the extracted logic involves:

* React state
* React effects
* React Query
* form state
* subscriptions
* browser APIs
* other hooks
* component lifecycle
* reusable UI behavior
* stateful application behavior tied to the component

Example:

```tsx
const UserForm = () => {
  const {
    values,
    errors,
    handleSubmit,
  } = useUserForm();

  return (
    <Form
      values={values}
      errors={errors}
      onSubmit={handleSubmit}
    />
  );
};
```

Prefer:

```text
hooks/
  useUserForm.ts
```

over:

```text
utils/
  userForm.ts
```

when the logic depends on React or represents stateful component behavior.

---

## Use Pure Functions for Pure Logic

Do not create a hook simply because logic is extracted from a component.

If logic:

* does not use React
* does not use hooks
* does not depend on lifecycle
* does not contain stateful UI behavior
* is deterministic/pure

prefer a normal function.

Example:

```ts
export const formatCurrency = (
  amount: number,
  currency: string,
) => {
  // ...
};
```

Do not create:

```ts
const useFormatCurrency = (...) => ...
```

for a pure, framework-independent operation.

### Decision Rule

When extracting logic from a component:

```text
Does the logic depend on React or represent
stateful/component behavior?
        │
        ├── Yes → Custom Hook
        │
        └── No → Pure Function
```

---

## Avoid Generic Utility Files

Do not create large catch-all files such as:

```text
utils.ts
helpers.ts
common.ts
misc.ts
```

containing unrelated functionality.

Prefer domain-specific modules:

```text
users/
  hooks/
    useUserForm.ts
  utils/
    formatUserName.ts
    getUserDisplayName.ts
```

Or colocate a pure function with the feature that owns it.

The goal is to keep logic close to the domain that owns it and avoid global dumping grounds for unrelated utilities.

---

## Hooks

Custom hooks should encapsulate behavior and expose a small, intentional API.

Prefer:

```ts
const useUserForm = () => {
  const [values, setValues] = useState(initialValues);

  const handleSubmit = () => {
    // ...
  };

  return {
    values,
    handleSubmit,
  };
};
```

Avoid exposing implementation details unnecessarily:

```ts
return {
  values,
  setValues,
  setErrors,
  internalState,
  internalValidationState,
  ...
};
```

A hook should return what its consumers actually need.

---

## State

Keep state as close as possible to where it is used.

Do not lift state unless multiple components actually need it.

Do not store derived state.

Avoid:

```tsx
const [users, setUsers] = useState<User[]>([]);
const [userCount, setUserCount] = useState(0);
```

Prefer:

```tsx
const [users, setUsers] = useState<User[]>([]);

const userCount = users.length;
```

Keep the state model minimal.

---

## Component Purity

Rendering must be pure.

Do not perform side effects during render.

Avoid:

```tsx
const Component = () => {
  saveSomething();

  return <div />;
};
```

Side effects belong in:

* event handlers
* appropriate effects
* hooks
* external services

---

## Props

Treat props as immutable.

Pass only the data a component actually needs.

Avoid passing large objects for convenience when the component only requires a few properties.

Prefer:

```tsx
<UserCard
  name={user.name}
  avatar={user.avatar}
/>
```

over:

```tsx
<UserCard
  user={user}
  config={entireApplicationConfig}
/>
```

when those additional objects are not required.

---

## Event Handlers

Use descriptive event-handler names.

Prefer:

```ts
const handleSubmit = ...
const handleDelete = ...
const handleSearch = ...
const handleUserSelect = ...
```

Avoid vague names:

```ts
const handleClick = ...
const handleAction = ...
const handleEvent = ...
```

unless the action is genuinely generic.

---

## TanStack Query Mutations

Prefer `mutate` over `mutateAsync`.

Default:

```tsx
const { mutate } = useMutation({
  mutationFn: createUser,
  onSuccess: handleSuccess,
});

const handleSubmit = (data: CreateUserInput) => {
  mutate(data);
};
```

Use `mutateAsync` only when the caller genuinely needs a Promise.

Valid use cases include:

* sequential async operations
* awaiting the mutation result
* `try/catch` around the mutation
* composing multiple asynchronous operations
* using the mutation result in subsequent logic

Example:

```tsx
const { mutateAsync } = useMutation({
  mutationFn: createUser,
});

const handleSubmit = async (data: CreateUserInput) => {
  const user = await mutateAsync(data);
  await navigateToUser(user.id);
};
```

Do not use `mutateAsync` simply because the underlying operation is asynchronous.

---

## Mutation Side Effects

Prefer mutation-level callbacks for shared mutation behavior.

```ts
const handleInvalidateUsers = () => {
  queryClient.invalidateQueries({
    queryKey: ['users'],
  });
};

useMutation({
  mutationFn: updateUser,
  onSuccess: handleInvalidateUsers,
});
```

Use per-call callbacks when behavior is specific to the current UI action.

Do not pass an inline function to `onSuccess` or `onError`. Delegate to a named method.

Avoid:

```tsx
mutate(payload, {
  onSuccess: () => {
    dispatch(hideModal());
    dispatch(refreshApiTableData());
  },
});
```

Prefer:

```tsx
const handleUpdateSuccess = () => {
  dispatch(hideModal());
  dispatch(refreshApiTableData());
};

mutate(payload, { onSuccess: handleUpdateSuccess });
```

Do not duplicate mutation side effects across multiple components when the behavior belongs to the mutation itself.

---

## JSX

Keep JSX declarative.

Avoid substantial business logic directly inside JSX.

Avoid:

```tsx
<Button
  disabled={
    !user ||
    user.status === 'blocked' ||
    !permissions.includes('EDIT')
  }
/>
```

Prefer:

```ts
const canEdit = getCanEditUser(user, permissions);
```

```tsx
<Button disabled={!canEdit} />
```

Complex calculations belong in:

* hooks
* pure functions
* selectors
* domain/application services

---

## Conditional Rendering

Prefer early returns for meaningful loading, error, or empty states.

```tsx
if (isLoading) {
  return <Loader />;
}

if (!user) {
  return <NotFound />;
}

return <UserDetails user={user} />;
```

Avoid deeply nested ternaries.

---

## Lists

Always provide stable keys.

Prefer:

```tsx
users.map((user) => (
  <UserListItem
    key={user.id}
    user={user}
  />
))
```

Avoid array indexes as keys unless the list is genuinely static and cannot change order.

---

## Component Files

Prefer one main React component per file.

Supporting types, constants, and small helpers may live in the same file when they are tightly coupled to that component.

Example:

```tsx
type UserCardProps = {
  user: User;
};

const UserCard = ({ user }: UserCardProps) => (
  <Card>
    <UserName name={user.name} />
  </Card>
);

export default UserCard;
```

For reusable components, prefer:

```text
UserCard/
  UserCard.tsx
  UserCard.test.tsx
```

rather than large generic component files.

---

## Avoid Prop Drilling Through Unrelated Components

If data is passed through multiple components that do not use it, reconsider the structure.

Possible solutions:

* move state closer to consumers
* use composition
* use context for genuinely shared state
* use a feature-level hook

Do not introduce Context merely to avoid passing one or two props.

---

## Avoid Unnecessary React Abstractions

Do not create components solely to:

* reduce the number of JSX lines
* wrap a single element without adding behavior
* rename another component
* satisfy an arbitrary line count

Every extracted component should have a meaningful responsibility or reusable purpose.

---

## React Anti-Patterns

Avoid:

* class components in new code
* giant components
* components with multiple unrelated responsibilities
* API implementation details inside presentational components
* business logic embedded in JSX
* duplicated state
* derived state stored in `useState`
* unnecessary `useEffect`
* unnecessary `useMemo`
* unnecessary `useCallback`
* inline `onSuccess` / `onError` callbacks
* prop mutation
* state mutation
* deeply nested JSX
* generic "Utils" components
* generic `Props` types
* generic global utility files
* hooks created for pure functions
* components extracted solely to satisfy a line count

Prefer small, focused, composable React units.
