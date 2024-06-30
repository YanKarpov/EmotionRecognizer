from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim

app = Flask(__name__)
CORS(app)  # Это позволит вашему Flask приложению обрабатывать запросы из других источников

class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 8, kernel_size=3)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(8 * 4 * 4, 4)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = x.view(-1, 8 * 4 * 4)
        x = self.softmax(self.fc1(x))
        return x

model = SimpleCNN()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

@app.route('/train', methods=['POST'])
def train():
    data = request.json['trainData']
    inputs = np.array([d['paintField'] for d in data], dtype=np.float32).reshape(-1, 1, 10, 10)
    labels = np.array([d['label'] for d in data], dtype=np.int64)

    inputs = torch.tensor(inputs)
    labels = torch.tensor(np.argmax(labels, axis=1))

    for epoch in range(100):
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        print(f'Epoch {epoch+1}/100, Loss: {loss.item()}')

    return jsonify({"message": "Model trained successfully"})

@app.route('/predict', methods=['POST'])
def predict():
    paintField = request.json['paintField']
    input_tensor = torch.tensor(np.array(paintField, dtype=np.float32).reshape(1, 1, 10, 10))
    output = model(input_tensor)
    _, predicted = torch.max(output, 1)
    emotions = ["счастливое", "грустное", "злое", "удивленное"]
    return jsonify({"message": f"Я думаю это {emotions[predicted.item()]} лицо!"})

if __name__ == '__main__':
    app.run(debug=True)




