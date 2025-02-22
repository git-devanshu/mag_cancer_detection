from flask import Flask, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")

# Get the current script's directory
base_dir = os.path.dirname(os.path.abspath(__file__))

# Define the relative path to the model
model_path = os.path.join(base_dir, "new_SkinCancer.h5")

# Load the trained model
model = tf.keras.models.load_model(model_path)

# Class labels
class_names = ['benign', 'malignant']


def model_prediction(test_image):
    try:
        # Open the uploaded image using Pillow
        image = Image.open(test_image)

        # Resize the image to 128x128 pixels to match the input size expected by the ML model
        image = image.resize((128, 128))

        # Ensure the image is in RGB format
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Convert image to array and expand dimensions for batch processing
        input_arr = tf.keras.preprocessing.image.img_to_array(image)
        input_arr = np.array([input_arr])

        # Make predictions
        predictions = model.predict(input_arr)

        # Get the highest probability class and its confidence score
        result_index = np.argmax(predictions)
        confidence_score = float(predictions[0][result_index])

        return class_names[result_index], confidence_score
    except Exception as e:
        return "Error", None  # Ensure tuple return even on error


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Call the model_prediction function with the uploaded file
        result, confidence = model_prediction(file)
        print(result)

        if isinstance(result, str) and confidence is not None:
            percentage = round(confidence * 100, 2)
            # Return prediction, confidence, and an additional severity field
            return jsonify({
                "prediction": result,
                "confidence": percentage,
                "severity": f"Severity: {percentage}%"
            }), 200
        else:
            return jsonify({"error": "Prediction failed"}), 500
    except Exception as e:
        return jsonify({"error": f"Error in prediction: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)