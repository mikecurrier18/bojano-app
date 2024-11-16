from . import properties
from .routes import router

router.include_router(properties.router)
