# dummy-llm-api

You are a Product Owner...
I want to build a cool app that will make me rich.
I want you to create the app dummy AI api. It's a backend of an API, whenever it receives a request, it just shows this request in a chat page, and the admin would manually input the response to it, if the admin have not yet input any code, please just wait and do nothing about the response. So when the admin opens his portal, he should see a list of request, most of them are complete, he could copy one of the new request with a button, he could respond the request with a input box. Please use Python and Flask framework, and break the task into detailed steps and show me how to do.

```bash
conda create --name py312dla python=3.12
source activate py312dla
pip install Flask

pip list --format=freeze > requirements.txt
pip install -r requirements.txt
pip install -r requirements.txt --upgrade
```

```bash
curl -X POST http://127.0.0.1:5000/new-request -H "Content-Type: application/json" -d '{"test_key": "test_value"}'
```
