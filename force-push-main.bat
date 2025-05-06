@echo off
echo Creating a new branch called main...
git checkout -b main-new

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Push all project files to main branch"

echo Force pushing to GitHub main branch...
git push -f origin main-new:main

echo Done!
pause
