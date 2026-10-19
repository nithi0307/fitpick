"""Endpoints that expose the figures calculated by the analytics service."""

from fastapi import APIRouter, Depends

from deps import current_user_id
from repositories import get_clothing_repository, get_outfit_repository
from repositories.base import ClothingRepository, OutfitRepository
from schemas import AnalyticsStats, DashboardStats
from services import analytics_service

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(
    clothing: ClothingRepository = Depends(get_clothing_repository),
    outfits: OutfitRepository = Depends(get_outfit_repository),
    user_id: int = Depends(current_user_id),
):
    return analytics_service.dashboard_stats(clothing, outfits, user_id)


@router.get("/analytics", response_model=AnalyticsStats)
def analytics(
    clothing: ClothingRepository = Depends(get_clothing_repository),
    user_id: int = Depends(current_user_id),
):
    return analytics_service.analytics_stats(clothing, user_id)
