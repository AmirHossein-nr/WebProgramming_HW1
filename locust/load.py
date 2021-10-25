from locust import HttpUser, task

class HelloWorldUser(HttpUser):
    @task
    def load_index(self):
        self.client.get("/ip/go/sha256?hash=1677238712")