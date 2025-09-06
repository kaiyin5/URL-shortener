@echo off
cd /d "%~dp0"
pip install -r requirements.txt
python -m pygbag --width 600 --height 480 main.py