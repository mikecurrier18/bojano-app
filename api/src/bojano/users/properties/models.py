import pydantic


class PropertyCreate(pydantic.BaseModel):
    user_id: str
    name: str


class Property(pydantic.BaseModel):
    id: str
    name: str
