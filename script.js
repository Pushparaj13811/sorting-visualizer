const arrayContainer = document.getElementById("array-container");
const statusText = document.getElementById("status-text");
const timeText = document.getElementById("time-text");
const algorithmSelect = document.getElementById("algorithm-select");
const timeComplexityText = document.getElementById("time-complexity-text");
const spaceComplexityText = document.getElementById("space-complexity-text");
const stopSorting = document.getElementById("stop-sorting-button");
const inputArray = document.getElementById("arrayInput");
const delay = 50;
const mainColor = "blue";
const visualColor = "crimson";
const finalColor = "blue";

let isSorting = true;
let isPaused = false;
let pauseAlgorithm = null;

// Function to update title

function updateTitle() {
  const selectedAlgorithm =
    algorithmSelect.options[algorithmSelect.selectedIndex].text;
  document.title = `Sorting Algorithm Visualizer - ${selectedAlgorithm}`;
}

algorithmSelect.addEventListener("change", updateTitle);
updateTitle();

// Function to get input array from user
function getArray() {
  const input = inputArray.value;
  const array = input.split(" ").map(Number);
  return array;
}

// Function to visualize array in bar format
async function visualizeArray(array) {
  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar) => {
    bar.style.backgroundColor = mainColor;
  });

  for (let i = 0; i < array.length; i++) {
    if (bars[i]) {
      bars[i].style.height = `${array[i] * 4}px`;
    } else {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${array[i] * 4}px`;
      bar.style.backgroundColor = mainColor;
      arrayContainer.appendChild(bar);
    }
  }
}
// Clear the array visualization
inputArray.addEventListener("input", () => {
    arrayContainer.innerHTML = '';
  });

// Time and space complexity information
const complexities = {
  bubble: { time: "O(n²)", space: "O(1)" },
  selection: { time: "O(n²)", space: "O(1)" },
  insertion: { time: "O(n²)", space: "O(1)" },
  merge: { time: "O(n log n)", space: "O(n)" },
  quick: { time: "O(n log n)", space: "O(log n)" },
  heap: { time: "O(n log n)", space: "O(1)" },
  counting: { time: "O(n + k)", space: "O(k)" },
  radix: { time: "O(nk)", space: "O(n + k)" },
  bucket: { time: "O(n²)", space: "O(n)" },
};

// Perform sorting operation and display the result
document.getElementById("sort-button").addEventListener("click", async () => {
  let array = getArray();
  visualizeArray(array);

  const selectedAlgorithm = algorithmSelect.value;
  statusText.innerText = "Status : Sorting...";
  timeText.innerText = "Total Time taken : ";
  timeComplexityText.innerText = "Time complexity : ";
  spaceComplexityText.innerText = "Space complexity : ";
  const startTime = performance.now();

  if (selectedAlgorithm === "bubble") {
    await bubbleSort(array);
  } else if (selectedAlgorithm === "selection") {
    await selectionSort(array);
  } else if (selectedAlgorithm === "insertion") {
    await insertionSort(array);
  } else if (selectedAlgorithm === "merge") {
    await mergeSort(array);
  } else if (selectedAlgorithm === "quick") {
    await quickSort(array);
  } else if (selectedAlgorithm === "heap") {
    await heapSort(array);
  } else if (selectedAlgorithm === "counting") {
    await countingSort(array);
  } else if (selectedAlgorithm === "radix") {
    await radixSort(array);
  } else if (selectedAlgorithm === "bucket") {
    await bucketSort(array);
  } else {
    statusText.innerText = "Please select an algorithm.";
  }

  const endTime = performance.now();
  const totalTime = (endTime - startTime).toFixed(2);
  statusText.innerText = "Sorted!";
  timeText.innerText = `Total Time taken : ${totalTime} ms using ${
    selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)
  } Sort`;

  timeComplexityText.innerText = `Time Complexity: ${complexities[selectedAlgorithm].time}`;
  spaceComplexityText.innerText = `Space Complexity: ${complexities[selectedAlgorithm].space}`;

  document.querySelectorAll(".bar").forEach((bar) => {
    bar.style.backgroundColor = finalColor;
  });
});

// Add a function to reset the array
function resetArray() {
  array = getArray();
  visualizeArray(array);
}

document.getElementById("reset-button").addEventListener("click", resetArray);

// Stop/Resume sorting button functionality
stopSorting.addEventListener("click", () => {
  if (isPaused) {
    isPaused = false;
    stopSorting.innerText = "Stop";
    if (pauseAlgorithm) {
      pauseAlgorithm();
    }
  } else {
    isPaused = true;
    stopSorting.innerText = "Resume";
  }
});

// Helper function to color a specific range of bars
function colorBars(bars, indices, color) {
  indices.forEach((index) => {
    bars[index].style.backgroundColor = color;
  });
}

// Bubble Sort
async function bubbleSort(array) {
  const bars = document.querySelectorAll(".bar");
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (isPaused) {
        pauseAlgorithm = () => bubbleSort(array);
        return;
      }

      colorBars(bars, [j, j + 1], visualColor);
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
        visualizeArray(array);
      }

      colorBars(bars, [j, j + 1], mainColor);
    }

    if (!swapped) break;
  }
  visualizeArray(array);
}

// Selection Sort
async function selectionSort(array) {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    colorBars(bars, [minIdx], visualColor);

    for (let j = i + 1; j < array.length; j++) {
      if (isPaused) {
        pauseAlgorithm = () => selectionSort(array);
        return;
      }
      colorBars(bars, [j], visualColor);
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (array[j] < array[minIdx]) {
        colorBars(bars, [minIdx], mainColor);
        minIdx = j;
        colorBars(bars, [minIdx], visualColor);
      }

      colorBars(bars, [j], mainColor);
    }

    [array[i], array[minIdx]] = [array[minIdx], array[i]];
    visualizeArray(array);
    colorBars(bars, [minIdx], mainColor);
  }
}

// Insertion Sort
async function insertionSort(array) {
  const bars = document.querySelectorAll(".bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    colorBars(bars, [i], visualColor);
    await new Promise((resolve) => setTimeout(resolve, delay));

    while (j >= 0 && array[j] > key) {
      if (isPaused) {
        pauseAlgorithm = () => insertionSort(array);
        return;
      }
      colorBars(bars, [j], visualColor);
      array[j + 1] = array[j];
      visualizeArray(array);
      await new Promise((resolve) => setTimeout(resolve, delay));
      colorBars(bars, [j], mainColor);
      j--;
    }

    array[j + 1] = key;
    visualizeArray(array);
    colorBars(bars, [i], mainColor);
  }
}

// Merge Sort
async function mergeSort(array) {
  if (array.length <= 1) {
    return array;
  }

  const mid = Math.floor(array.length / 2);
  const left = await mergeSort(array.slice(0, mid));
  const right = await mergeSort(array.slice(mid));

  return await merge(left, right, array);
}

async function merge(left, right, originalArray) {
  let i = 0,
    j = 0,
    k = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      originalArray[k++] = left[i++];
    } else {
      originalArray[k++] = right[j++];
    }

    colorBars(document.querySelectorAll(".bar"), [k - 1], mainColor);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  while (i < left.length) {
    originalArray[k++] = left[i++];
    colorBars(document.querySelectorAll(".bar"), [k - 1], mainColor);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  while (j < right.length) {
    originalArray[k++] = right[j++];
    colorBars(document.querySelectorAll(".bar"), [k - 1], mainColor);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  visualizeArray(originalArray);
  return originalArray;
}

// Quick Sort
async function quickSort(array, low = 0, high = array.length - 1) {
  if (low < high) {
    const pi = await partition(array, low, high);
    await quickSort(array, low, pi - 1);
    await quickSort(array, pi + 1, high);
  }
}

async function partition(array, low, high) {
  const pivot = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (isPaused) {
      pauseAlgorithm = () => quickSort(array);
      return;
    }
    colorBars(document.querySelectorAll(".bar"), [j], visualColor);
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      visualizeArray(array);
    }

    colorBars(document.querySelectorAll(".bar"), [j], mainColor);
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  visualizeArray(array);
  return i + 1;
}

// Heap Sort
async function heapSort(array) {
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(array, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    await visualizeArray(array);
    await heapify(array, i, 0);
  }
}

async function heapify(array, n, i) {
  let largest = i;
  const bars = document.querySelectorAll(".bar");
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    visualizeArray(array);
    await heapify(array, n, largest);
  }
}

// Counting Sort
async function countingSort(array) {
  if (array.length === 0) return;

  const max = Math.max(...array);
  const count = new Array(max + 1).fill(0);
  const output = new Array(array.length);

  for (let i = 0; i < array.length; i++) {
    count[array[i]]++;
  }

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  for (let i = array.length - 1; i >= 0; i--) {
    if (isPaused) {
      pauseAlgorithm = () => countingSort(array);
      return;
    }

    const currentValue = array[i];
    const index = count[currentValue] - 1;

    output[index] = currentValue;

    colorBars(document.querySelectorAll(".bar"), [i], visualColor);
    await new Promise((resolve) => setTimeout(resolve, delay));

    count[currentValue]--;
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    colorBars(document.querySelectorAll(".bar"), [i], mainColor);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  visualizeArray(array);
}

// Radix Sort
async function radixSort(array) {
  const max = Math.max(...array);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortForRadix(array, exp, delay);
    visualizeArray(array);
  }
}

async function countingSortForRadix(array, exp, delay) {
  const output = new Array(array.length);
  const count = new Array(10).fill(0);

  for (let i = 0; i < array.length; i++) {
    const index = Math.floor(array[i] / exp) % 10;
    count[index]++;
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = array.length - 1; i >= 0; i--) {
    const index = Math.floor(array[i] / exp) % 10;
    output[count[index] - 1] = array[i];
    count[index]--;

    colorBars(document.querySelectorAll(".bar"), [i], visualColor);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    colorBars(document.querySelectorAll(".bar"), [i], mainColor);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  visualizeArray(array);
}

// Bucket Sort
async function bucketSort(array) {
  const bucketCount = 10;
  const buckets = Array.from({ length: bucketCount }, () => []);
  const bars = document.querySelectorAll(".bar");

  for (let i = 0; i < array.length; i++) {
    const bucketIndex = Math.floor(
      (array[i] / Math.max(...array)) * (bucketCount - 1)
    );
    buckets[bucketIndex].push(array[i]);
    colorBars(bars, [i], visualColor);
    await new Promise((resolve) => setTimeout(resolve, delay));
    colorBars(bars, [i], mainColor);
  }

  let index = 0;
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i].length > 0) {
      const sortedBucket = await insertionSort(buckets[i]);
      for (let j = 0; j < sortedBucket.length; j++) {
        array[index++] = sortedBucket[j];
      }
    }
  }

  visualizeArray(array);
}

async function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;

    await new Promise((resolve) => setTimeout(resolve, delay));
    visualizeArray(array);
  }
  return array;
}
