from PIL import Image
import sys

def remove_black_background(input_path, output_path, threshold=50):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # item is (R, G, B, A)
        # Check if pixel is close to black
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            newData.append((255, 255, 255, 0))  # Transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

if __name__ == "__main__":
    input_file = "src/assets/images/lungs_new.png"
    output_file = "src/assets/images/lungs_transparent.png"
    remove_black_background(input_file, output_file)
