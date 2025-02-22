from flask import Flask, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
import io
from flask_cors import CORS
import os

# from flask import Flask, request, jsonify:
# Imports Flask for creating the web application, request to handle incoming HTTP requests,
# and jsonify to return JSON responses.

# import tensorflow as tf:
# Imports TensorFlow to load the trained ML model and perform predictions.

# from PIL import Image:
# Imports the Python Imaging Library (Pillow) to handle image processing tasks.



app = Flask(__name__)
CORS(app, origins="http://localhost:3000")  

model = tf.keras.models.load_model(r"C:\Users\varad\OneDrive\Desktop\Web_Projects\Cancer-Detection\server\trained_model.h5")


class_names = ["glioma", "meningioma", "notumor", "pituitary"]


def model_prediction(test_image):
    try:
        #Opens the uploaded image using Pillow.
        image = Image.open(test_image)
        
        #Resizes the image to 128x128 pixels to match the input size expected by the ML model.
        image = image.resize((128, 128)) 
         
        #Ensures the image is in RGB format. Converts it if not already in RGB.
        if image.mode != 'RGB':
            image = image.convert('RGB')  


        #TensorFlow models require inputs in the form of NumPy arrays. 
        #This conversion transforms the image into a numerical representation that the 
        #model can process.
        input_arr = tf.keras.preprocessing.image.img_to_array(image)
        
        #Adds an extra dimension to the array, making it compatible with the input shape 
        #expected by TensorFlow models.
        #By wrapping the array in another array, the shape changes from (128, 128, 3) to (1, 128, 128, 3). 
        #The first dimension (1) represents the batch size (one image in this case).
        input_arr = np.array([input_arr])  

        #Makes predictions using the loaded model on the processed image.
        predictions = model.predict(input_arr)

        #Finds the index of the class with the highest predicted probability.
        #predictions = [0.1, 0.3, 0.05, 0.55]
        #argmax->Finds the index of the largest value (which corresponds to the most likely class).
        result_index = np.argmax(predictions)

        #Returns the class name corresponding to the predicted index.
        return class_names[result_index]
    except Exception as e:
        return str(e)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    #Extracts the uploaded file from the request.
    file = request.files['file']

    #If the filename is empty, it returns a JSON response with an error message 
    #and HTTP status 400 (Bad Request).
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
       #Calls the model_prediction function with the uploaded file to get the 
       #classification result
        result = model_prediction(file)
        
        #isinstance function in this case checks result is string or not if striing it return true
        if isinstance(result, str):  
            return jsonify({"prediction": result}), 200
        else:
            return jsonify({"error": "Prediction failed"}), 500
    except Exception as e:
        return jsonify({"error": f"Error in prediction: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
