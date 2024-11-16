import fastapi
import uvicorn
from bojano import expense_sheets, users

app = fastapi.FastAPI(debug=True)
router_main = fastapi.APIRouter(prefix="/api/v1")

router_main.include_router(expense_sheets.router)
router_main.include_router(users.router)

app.include_router(router_main)
uvicorn.run(app, host="0.0.0.0", port=1140)
