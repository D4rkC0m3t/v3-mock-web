@echo off
echo Checking current branch...
git branch

echo Switching to main branch...
git checkout main || git checkout -b main

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Push all project files to main branch"

echo Pushing to GitHub main branch...
git push -u origin main

echo Done!
pause
