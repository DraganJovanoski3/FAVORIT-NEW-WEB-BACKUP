@echo off
echo ========================================
echo Favorit Electronics - Main Directory Build
echo ========================================
echo.

echo [1/6] Building Angular application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Angular build failed!
    pause
    exit /b 1
)
echo ✓ Angular build completed
echo.

echo [2/6] Generating static HTML files...
python generate_static_html.py
if %errorlevel% neq 0 (
    echo ERROR: Static HTML generation failed!
    pause
    exit /b 1
)
echo ✓ Static HTML files generated
echo.

echo [3/6] Validating static files...
python validate_static_files.py
if %errorlevel% neq 0 (
    echo WARNING: Some static files have validation issues
)
echo ✓ Static files validation completed
echo.

echo [4/6] Generating sitemap...
python generate_sitemap.py
if %errorlevel% neq 0 (
    echo ERROR: Sitemap generation failed!
    pause
    exit /b 1
)
echo ✓ Sitemap generated
echo.

echo [5/6] Flattening structure for main directory...
echo Moving Angular files to root...
move "dist\public_html\browser\*" "dist\public_html\"
rmdir "dist\public_html\browser"
echo Moving static HTML files to root...
move "dist\public_html\static\*" "dist\public_html\"
rmdir "dist\public_html\static"
echo Copying additional files...
copy "sitemap.xml" "dist\public_html\"
copy "robots.txt" "dist\public_html\"
copy "product-*.html" "dist\public_html\"
echo ✓ Structure flattened
echo.

echo [6/6] Finalizing build...
echo ✓ Main directory build completed successfully!
echo.
echo ========================================
echo BUILD SUMMARY
echo ========================================
echo - All files: dist/public_html/
echo - Angular app: dist/public_html/index.html
echo - Static HTML: dist/public_html/product-*.html
echo - Sitemap: dist/public_html/sitemap.xml
echo - Robots: dist/public_html/robots.txt
echo - .htaccess: dist/public_html/.htaccess
echo ========================================
echo.
echo Ready for deployment to public_html directory!
echo Upload ALL contents of dist/public_html/ to your public_html folder
pause
