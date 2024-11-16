import fastapi
import uvicorn

from . import expense_sheets, users


def main() -> None:
    """The main entry point to the program"""
    app = fastapi.FastAPI()
    router_main = fastapi.APIRouter(prefix="/api/v1")

    router_main.include_router(expense_sheets.router)
    router_main.include_router(users.router)

    app.include_router(router_main)
    uvicorn.run(app, host="0.0.0.0", port=1140)


if __name__ == "__main__":
    main()
