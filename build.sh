sudo docker build -t dashboard-api .
sudo docker run -d --network host --name dashboard-api dashboard-api
