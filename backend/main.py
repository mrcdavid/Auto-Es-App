from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth  # Import router
from routes.password_reset import router as password_reset_router

app = FastAPI()

# CORS settings
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include routers
app.include_router(auth.router)
app.include_router(password_reset_router, prefix="/api")
