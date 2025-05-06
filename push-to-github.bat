@echo off
echo Initializing Git repository...
git init

echo Adding remote repository...
git remote add origin https://github.com/D4rkC0m3t/v3-mock-web.git

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Initial commit with VDEX application"

echo Pushing to GitHub...
git push -u origin master

echo Done!
pause
