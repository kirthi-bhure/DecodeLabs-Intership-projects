# AI-Based Text Recognition Using OCR

## Project Overview

This project demonstrates Optical Character Recognition (OCR) using Tesseract OCR and OpenCV. The system extracts text from an image by applying image preprocessing techniques such as grayscale conversion and adaptive thresholding before performing text recognition.

The project was implemented using Python in Google Colab.

---

## Objective

To develop an OCR-based text recognition system capable of extracting machine-readable text from images.

---

## Technologies Used

* Python
* Google Colab
* OpenCV
* Tesseract OCR
* Matplotlib

---

## Project Workflow

Input Image
↓
Grayscale Conversion
↓
Adaptive Thresholding
↓
Text Recognition using Tesseract OCR
↓
Extracted Text Output

---

## Features

* Reads text from images
* Converts color images to grayscale
* Applies adaptive thresholding for better OCR accuracy
* Extracts text using Tesseract OCR
* Displays processed images and OCR results

---

## Installation

### Google Colab

Run the following commands:

```python
!apt-get install tesseract-ocr -y
!pip install pytesseract opencv-python
```

---

## Usage

### Upload an Image

```python
from google.colab import files
uploaded = files.upload()
```

### OCR Processing

```python
import cv2
import pytesseract

image_path = list(uploaded.keys())[0]

img = cv2.imread(image_path)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

thresh = cv2.adaptiveThreshold(
    gray,
    255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv2.THRESH_BINARY,
    11,
    2
)

text = pytesseract.image_to_string(thresh)

print(text)
```

---

## Sample Output

Detected Text:

Artificial Intelligence Project 4

Name: Kirthi

Roll No: 3048

OCR Using Tesseract

This is a sample OCR project.

Text recognition using Tesseract OCR.

---

## Results

The OCR system successfully extracted text from the input image after preprocessing. The grayscale conversion and thresholding stages improved text visibility and recognition accuracy.

---

## Applications

* Document digitization
* Automated form processing
* Receipt scanning
* License plate recognition
* Text extraction from images

---

## Future Enhancements

* Handwritten text recognition
* Multi-language OCR support
* Real-time OCR using webcam
* Integration with cloud-based OCR services

---

## Conclusion

This project demonstrates how Optical Character Recognition can be used to extract text from images efficiently. By combining OpenCV image preprocessing techniques with Tesseract OCR, the system achieves reliable text recognition suitable for various practical applications.

---

## Author

**Name:** Kirthi
**Roll No:** 4125

Artificial Intelligence Project 4
