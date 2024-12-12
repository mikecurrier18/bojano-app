import pydantic


class UserCreate(pydantic.BaseModel):
    first_name: str
    last_name: str | None = None
    email_address: list[str]


class User(pydantic.BaseModel):
    id: str
    first_name: str
    last_name: str | None = None
    # NOTE: This is different from email_address in UserCreate.
    email_addresses: list[str]
