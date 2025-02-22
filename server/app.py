from flask import Flask, request, jsonify, send_file
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os
import cv2
import matplotlib.pyplot as plt
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")  

# Load the trained model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "SkinCancer.h5")
model = tf.keras.models.load_model(model_path)

class_names = ['benign', 'malignant']

def preprocess_image(image_file, target_size=(128, 128)):
    """Preprocess image for model prediction."""
    image = Image.open(image_file)
    image = image.resize(target_size)

    if image.mode != 'RGB':
        image = image.convert('RGB')

    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.expand_dims(input_arr, axis=0)  # Add batch dimension
    return input_arr

def model_prediction(image_file):
    """Predict class of skin lesion (benign/malignant)."""
    try:
        input_arr = preprocess_image(image_file)
        predictions = model.predict(input_arr)
        result_index = np.argmax(predictions)
        return class_names[result_index]
    except Exception as e:
        return str(e)

def generate_gradcam(image_file, last_conv_layer="conv2d_3"):
    """Generate Grad-CAM heatmap."""
    try:
        img_array = preprocess_image(image_file)

        # Define model to fetch convolutional layer and predictions
        grad_model = tf.keras.models.Model(
            inputs=model.input, 
            outputs=[model.get_layer(last_conv_layer).output, model.output]
        )

        with tf.GradientTape() as tape:
            conv_output, predictions = grad_model(img_array)
            pred_index = tf.argmax(predictions[0])
            class_channel = predictions[:, pred_index]

        # Compute gradients
        grads = tape.gradient(class_channel, conv_output)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        # Generate heatmap
        conv_output = conv_output[0]
        heatmap = tf.reduce_sum(tf.multiply(pooled_grads, conv_output), axis=-1)

        # Normalize heatmap
        heatmap = np.maximum(heatmap, 0)
        heatmap /= np.max(heatmap)

        # Overlay heatmap on original image
        image = Image.open(image_file)
        image = image.resize((128, 128))
        image = np.array(image)

        heatmap = cv2.resize(heatmap.numpy(), (image.shape[1], image.shape[0]))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        superimposed_img = cv2.addWeighted(heatmap, 0.5, image, 0.5, 0)

        # Save and return the heatmap image
        heatmap_path = os.path.join(base_dir, "gradcam_output.jpg")
        cv2.imwrite(heatmap_path, superimposed_img)
        return heatmap_path

    except Exception as e:
        return str(e)

@app.route('/predict', methods=['POST'])
def predict():
    """Predict skin cancer class."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        result = model_prediction(file)
        if isinstance(result, str):
            return jsonify({"prediction": result}), 200
        else:
            return jsonify({"error": "Prediction failed"}), 500
    except Exception as e:
        return jsonify({"error": f"Error in prediction: {str(e)}"}), 500

@app.route('/gradcam', methods=['POST'])
def gradcam():
    """Generate Grad-CAM heatmap."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        heatmap_path = generate_gradcam(file)
        if os.path.exists(heatmap_path):
            return send_file(heatmap_path, mimetype='image/jpeg')
        else:
            return jsonify({"error": "Grad-CAM generation failed"}), 500
    except Exception as e:
        return jsonify({"error": f"Error generating Grad-CAM: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
