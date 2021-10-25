from locust import HttpUser, task

class HelloWorldUser(HttpUser):
    @task
    def load_index(self):
        self.client.get("/ip/node/sha256?hash=66c3f0ff5b53c7ba2e6c53ea2be3e7a1d5e1fb3e3ae9d9a211e1e898bb43eb00")