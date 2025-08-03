'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { JSX } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

function getTabContent(tab: string): JSX.Element {
  switch (tab) {
    case 'linear':
      return (
        <div className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold">Linear Curve Fitting</h2>
          <p>
            Linear curve fitting, or simple linear regression, models the relationship between two variables
            by fitting a straight line through the data. It assumes the relationship follows:
          </p>
          <BlockMath math="y = mx + c" />
          <p>
            Here, <InlineMath math="m" /> is the slope of the line and <InlineMath math="c" /> is the y-intercept.
            The goal is to find the values of <InlineMath math="m" /> and <InlineMath math="c" /> that minimize the
            sum of the squared differences between the observed and predicted values.
          </p>
          <h3 className="font-medium">Error Minimization</h3>
          <p>
            We use the method of least squares, minimizing:
          </p>
          <BlockMath math="S = \sum_{i=1}^n (y_i - (mx_i + c))^2" />
          <p>
            Taking derivatives of <InlineMath math="S" /> with respect to <InlineMath math="m" /> and <InlineMath math="c" />,
            and setting them to zero yields:
          </p>
          <BlockMath math="m = \frac{n\sum x_i y_i - \sum x_i \sum y_i}{n\sum x_i^2 - (\sum x_i)^2}" />
          <BlockMath math="c = \frac{\sum y_i - m\sum x_i}{n}" />
          <p>
            Once <InlineMath math="m" /> and <InlineMath math="c" /> are calculated, the fitted line
            <InlineMath math="y = mx + c" /> can be used to make predictions or interpret the relationship.
          </p>
        </div>
      );
    case 'polynomial':
      return (
                <div className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold">Polynomial Curve Fitting</h2>

          <p>
            Polynomial curve fitting generalizes linear fitting by modeling the relationship between
            the independent variable <InlineMath math="x" /> and dependent variable <InlineMath math="y" />
            as an <InlineMath math="n" />-degree polynomial:
          </p>

          <BlockMath math="y = a_0 + a_1x + a_2x^2 + \dots + a_nx^n" />

          <p>
            The aim is to determine the coefficients <InlineMath math="a_0, a_1, ..., a_n" />
            such that the polynomial best fits the data using the least squares criterion.
          </p>

          <h3 className="font-medium">Least Squares Formulation</h3>
          <p>
            For <InlineMath math="m" /> data points <InlineMath math="(x_1, y_1), ..., (x_m, y_m)" />,
            the sum of squared errors is:
          </p>

          <BlockMath math="S = \sum_{i=1}^m \left( y_i - \sum_{j=0}^n a_j x_i^j \right)^2" />

          <p>
            This is a linear system in terms of the unknowns <InlineMath math="a_0, a_1, ..., a_n" />.
            We solve it using matrix methods:
          </p>

          <BlockMath math="\mathbf{A}\mathbf{a} = \mathbf{y}" />

          <p>
            Where:
            <ul className="list-disc list-inside ml-4">
              <li><InlineMath math="\mathbf{A}" /> is the Vandermonde matrix built from <InlineMath math="x" /> values,</li>
              <li><InlineMath math="\mathbf{a}" /> is the vector of unknown coefficients,</li>
              <li><InlineMath math="\mathbf{y}" /> is the vector of <InlineMath math="y_i" /> values.</li>
            </ul>
          </p>

          <BlockMath math="\mathbf{a} = (\mathbf{A}^T \mathbf{A})^{-1} \mathbf{A}^T \mathbf{y}" />

          <h3 className="font-medium">Advantages and Considerations</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Higher-degree polynomials can fit more complex data patterns.</li>
            <li>Risk of overfitting if the degree is too high relative to the number of points.</li>
            <li>Model becomes unstable or oscillatory for high degrees.</li>
          </ul>

          <p>
            Polynomial fitting is useful when the relationship between variables is nonlinear but can be
            approximated well by a polynomial function.
          </p>
        </div>

      );
    case 'power':
      return (
        <div className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold">Power Curve Fitting</h2>

          <p>
            Power curve fitting models the relationship between variables using a power-law equation:
          </p>

          <BlockMath math="y = ax^b" />

          <p>
            This model is useful when the data shows a nonlinear relationship that follows a scale-invariant pattern,
            meaning proportional changes in <InlineMath math="x" /> lead to proportional changes in <InlineMath math="y" />.
          </p>

          <h3 className="font-medium">Linearization Using Logarithms</h3>
          <p>
            To simplify fitting, we take logarithms on both sides:
          </p>

          <BlockMath math="\log(y) = \log(a) + b\log(x)" />

          <p>
            This transforms the model into a linear relationship between <InlineMath math="\log(x)" /> and <InlineMath math="\log(y)" />,
            allowing us to apply linear regression:
          </p>

          <BlockMath math="Y' = bX' + \log(a)" />

          <p>
            where <InlineMath math="X' = \log(x)" /> and <InlineMath math="Y' = \log(y)" />.
            The slope of the fitted line gives <InlineMath math="b" />, and the intercept gives <InlineMath math="\log(a)" />.
            Taking the exponential of the intercept gives <InlineMath math="a" />:
          </p>

          <BlockMath math="a = e^{\log(a)}" />

          <h3 className="font-medium">When to Use</h3>
          <ul className="list-disc list-inside ml-4">
            <li>When both <InlineMath math="x" /> and <InlineMath math="y" /> are positive.</li>
            <li>When data appears multiplicative or scales exponentially on a log-log plot.</li>
            <li>When simpler models like linear or polynomial don’t capture multiplicative behavior.</li>
          </ul>

          <p>
            Note that all <InlineMath math="x" /> and <InlineMath math="y" /> values must be positive,
            as logarithms are undefined for zero or negative numbers.
          </p>
        </div>
      );
    case 'exponential':
      return (
                <div className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold">Exponential Curve Fitting</h2>

          <p>
            Exponential curve fitting models data that grows or decays at a constant relative rate, using the form:
          </p>

          <BlockMath math="y = ae^{bx}" />

          <p>
            Here:
            <ul className="list-disc list-inside ml-4">
              <li><InlineMath math="a" /> is the initial value (value at <InlineMath math="x = 0" />).</li>
              <li><InlineMath math="b" /> is the rate of growth (<InlineMath math="b > 0" />) or decay (<InlineMath math="b < 0" />).</li>
            </ul>
          </p>

          <h3 className="font-medium">Linearization Using Natural Log</h3>
          <p>
            To fit this model using least squares, we linearize the equation by taking the natural log of both sides:
          </p>

          <BlockMath math="\ln(y) = \ln(a) + bx" />

          <p>
            This is now a linear relationship between <InlineMath math="x" /> and <InlineMath math="\ln(y)" />, allowing us to perform linear regression on the transformed data.
          </p>

          <BlockMath math="Y' = bx + \ln(a)" />

          <p>
            Where <InlineMath math="Y' = \ln(y)" />. The slope of the fitted line gives <InlineMath math="b" />, and the intercept gives <InlineMath math="\ln(a)" />.
          </p>

          <p>
            Finally, exponentiating the intercept gives <InlineMath math="a" />:
          </p>

          <BlockMath math="a = e^{\ln(a)}" />

          <h3 className="font-medium">When to Use</h3>
          <ul className="list-disc list-inside ml-4">
            <li>When data shows rapid growth or decay (e.g., population, radioactive decay).</li>
            <li>When the rate of change is proportional to the current value.</li>
            <li>When plotting <InlineMath math="x" /> vs. <InlineMath math="\ln(y)" /> results in a straight line.</li>
          </ul>

          <p>
            All <InlineMath math="y" /> values must be positive since logarithms are undefined for non-positive numbers.
          </p>
        </div>

      );
    case 'error':
      return (
                <div className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold">Error Estimation</h2>

          <p>
            After fitting a curve to data, it's important to measure how well the model explains the data.
            This is done using various error metrics that quantify the difference between predicted and actual values.
          </p>

          <h3 className="font-medium">1. Sum of Squared Errors (SSE)</h3>
          <p>
            Measures the total squared deviation between predicted and actual values:
          </p>
          <BlockMath math="SSE = \sum_{i=1}^{n} (y_i - \hat{y}_i)^2" />
          <p>
            Lower SSE indicates a better fit. However, it depends on the scale of the data.
          </p>

          <h3 className="font-medium">2. Mean Squared Error (MSE)</h3>
          <p>
            Average of the squared errors:
          </p>
          <BlockMath math="MSE = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2" />
          <p>
            MSE is useful for comparing models across datasets of the same size.
          </p>

          <h3 className="font-medium">3. Root Mean Squared Error (RMSE)</h3>
          <p>
            Square root of MSE, bringing the units back to those of the original variable:
          </p>
          <BlockMath math="RMSE = \sqrt{MSE}" />

          <h3 className="font-medium">4. Coefficient of Determination (R²)</h3>
          <p>
            R² measures the proportion of the variance in the dependent variable that is predictable from the independent variable:
          </p>
          <BlockMath math="R^2 = 1 - \frac{SSE}{SST}" />
          <p>
            Where:
          </p>
          <BlockMath math="SST = \sum_{i=1}^{n} (y_i - \bar{y})^2" />
          <p>
            <InlineMath math="R^2" /> ranges from 0 to 1. A value close to 1 indicates a strong fit.
          </p>

          <h3 className="font-medium">Interpretation Summary</h3>
          <ul className="list-disc list-inside ml-4">
            <li><strong>SSE</strong>: Total error; useful for optimization.</li>
            <li><strong>MSE</strong>: Average error; penalizes larger errors more.</li>
            <li><strong>RMSE</strong>: Same scale as output; more interpretable.</li>
            <li><strong>R²</strong>: Proportion of explained variance; most common fit quality metric.</li>
          </ul>
        </div>

      );
    default:
      return <p>No content available.</p>;
  }
}


import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const tabs = ['linear', 'polynomial', 'power', 'exponential', 'error'];

export function FittingTheoryTabs() {
  const [activeTab, setActiveTab] = useState('linear');

  return (
    <Tabs
      defaultValue="linear"
      value={activeTab}
      onValueChange={setActiveTab}
      id="theory"
      className="w-full mt-6"
    >
      {/* Tabs List */}
      <div className="sticky top-2 z-10 bg-background pb-2">
        <TabsList className="grid grid-cols-5 justify-center w-full">
          {tabs.map((tab) => (
            <motion.div
              key={tab}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <TabsTrigger value={tab} className="capitalize">
                {tab}
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>
      </div>

      {/* Animated Tabs Content */}
      <AnimatePresence mode="wait">
        {tabs.map((tab) =>
          activeTab === tab ? (
            <TabsContent key={tab} value={tab} forceMount>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {getTabContent(tab)}
              </motion.div>
            </TabsContent>
          ) : null
        )}
      </AnimatePresence>
    </Tabs>
  );
}
