import pydantic


class UserCreate(pydantic.BaseModel):
    first_name: str
    last_name: str
    email_address: list[str]


class User(pydantic.BaseModel):
    id: str
    first_name: str
    last_name: str
    # NOTE: This is different from email_address in UserCreate.
    email_addresses: list[str]
