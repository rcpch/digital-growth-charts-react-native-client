/* 
Age padding is in years, so guides the x axis scale used to calculate the optimum x domains
For the purposes of working out age padding around points on a chart:
    - prem is <= 0.03832991 years (2 weeks corrected or 42 weeks gestation)
    - infant is <=1 years
    - small child is <= 4 years
    - bigger child is > 4
*/

const totalMinPadding = {
  prem: 0.07,
  infant: 0.3,
  smallChild: 1.6,
  biggerChild: 4.5,
};

export default totalMinPadding;
