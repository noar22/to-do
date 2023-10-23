function valueChange(checkbox) {
  console.log("hello");
  const label = document.getElementById('g01-01');
    if (label.checked) {
      label.style.textDecoration = 'line-through';
  } else {
      label.style.textDecoration = 'none';
  }
}
