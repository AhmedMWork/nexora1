# NEXORA V4.9 — Deploy active Supabase Edge Functions
# Run from project root:
# powershell -ExecutionPolicy Bypass -File .\scripts\deploy-supabase-functions.ps1

$ProjectRef = "ccmuazjkgzjqzybxwrfd"

supabase functions deploy verify-studio-access --project-ref $ProjectRef
supabase functions deploy create-order --project-ref $ProjectRef
supabase functions deploy validate-coupon --project-ref $ProjectRef
supabase functions deploy studio-dashboard --project-ref $ProjectRef
supabase functions deploy studio-products --project-ref $ProjectRef
supabase functions deploy studio-orders --project-ref $ProjectRef
supabase functions deploy studio-reviews --project-ref $ProjectRef
supabase functions deploy studio-drops --project-ref $ProjectRef
supabase functions deploy studio-coupons --project-ref $ProjectRef
supabase functions deploy studio-settings --project-ref $ProjectRef
supabase functions deploy studio-media-upload --project-ref $ProjectRef
supabase functions deploy studio-media-delete --project-ref $ProjectRef

Write-Host "NEXORA V4.9 active functions deployed." -ForegroundColor Green
