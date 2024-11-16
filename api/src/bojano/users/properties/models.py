import pydantic


class PropertyCreate(pydantic.BaseModel):
    user_id: str
    name: str


class Property(PropertyCreate):
    id: str
