export const generateLinearCode = (points: number [][]) => {
    const xValues = points.map(p => p[0]).join(", ");
    const yValues = points.map(p => p[1]).join(", ");

  return `import numpy as np
import matplotlib.pyplot as plt

# Input data
x = np.array([${xValues}])
y = np.array([${yValues}])

# Perform linear regression (degree = 1)
coefficients = np.polyfit(x, y, 1)
slope, intercept = coefficients
print(f"Slope: {slope}")
print(f"Intercept: {intercept}")
print(f"Equation: y = {slope:.4f}x + {intercept:.4f}")

# Generate predicted values
x_fit = np.linspace(min(x), max(x), 100)
y_fit = slope * x_fit + intercept

# Plot original data and fitted line
plt.scatter(x, y, color='red', label='Data Points')
plt.plot(x_fit, y_fit, color='blue', label='Fitted Line')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Linear Regression')
plt.legend()
plt.grid(True)
plt.show()`;
};


export const generatePowerCode = (points: number [][]) => {
  const xValues = points.map(p => p[0]).join(", ");
  const yValues = points.map(p => p[1]).join(", ");

  return `import numpy as np
import matplotlib.pyplot as plt

# Input data
x = np.array([${xValues}])
y = np.array([${yValues}])

# Remove non-positive values for log transform
mask = (x > 0) & (y > 0)
x = x[mask]
y = y[mask]

# Linearize using log-log
log_x = np.log(x)
log_y = np.log(y)

# Fit a line: log(y) = log(a) + b*log(x)
b, log_a = np.polyfit(log_x, log_y, 1)
a = np.exp(log_a)

print(f"a = {a}")
print(f"b = {b}")
print(f"Fitted Power Function: y = {a:.4f} * x^{b:.4f}")

# Generate fit line
x_fit = np.linspace(min(x), max(x), 100)
y_fit = a * x_fit**b

# Plot
plt.scatter(x, y, color='red', label='Data Points')
plt.plot(x_fit, y_fit, color='blue', label='Fitted Power Function')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Power Function Fitting: y = a·x^b')
plt.legend()
plt.grid(True)
plt.show()`;
};

export const generatePolynomialCode = ( points: number [][], degree: number) => {
  const xValues = points.map(p => p[0]).join(", ");
  const yValues = points.map(p => p[1]).join(", ");

  return `import numpy as np
import matplotlib.pyplot as plt

# Input data
x = np.array([${xValues}])
y = np.array([${yValues}])

# Fit a polynomial of degree ${degree}
coefficients = np.polyfit(x, y, ${degree})
polynomial = np.poly1d(coefficients)

# Print the polynomial
print("Polynomial Coefficients:", coefficients)
print("Fitted Polynomial:")
print(polynomial)

# Generate fitted curve
x_fit = np.linspace(min(x), max(x), 100)
y_fit = polynomial(x_fit)

# Plot
plt.scatter(x, y, color='red', label='Data Points')
plt.plot(x_fit, y_fit, color='blue', label='Polynomial Fit (deg=${degree})')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Polynomial Curve Fitting')
plt.legend()
plt.grid(True)
plt.show()`;
};

export const generateExponentialCode = (points: number [][]) => {
  const xValues = points.map(p => p[0]).join(", ");
  const yValues = points.map(p => p[1]).join(", ");

  return `import numpy as np
import matplotlib.pyplot as plt

# Input data
x = np.array([${xValues}])
y = np.array([${yValues}])

# Remove non-positive y values (log not defined)
mask = y > 0
x = x[mask]
y = y[mask]

# Transform: ln(y) = ln(a) + bx
log_y = np.log(y)

# Linear regression on transformed data
b, log_a = np.polyfit(x, log_y, 1)
a = np.exp(log_a)

print(f"a = {a}")
print(f"b = {b}")
print(f"Fitted Exponential Function: y = {a:.4f} * e^({b:.4f}x)")

# Generate fitted curve
x_fit = np.linspace(min(x), max(x), 100)
y_fit = a * np.exp(b * x_fit)

# Plot
plt.scatter(x, y, color='red', label='Data Points')
plt.plot(x_fit, y_fit, color='blue', label='Fitted Exponential Curve')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Exponential Curve Fitting: y = ae^{bx}')
plt.legend()
plt.grid(True)
plt.show()`;
};
