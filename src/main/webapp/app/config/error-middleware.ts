const getErrorMessage = errorData => {
  let { message } = errorData;
  if (errorData.fieldErrors) {
    errorData.fieldErrors.forEach(fErr => {
      message += `\nfield: ${fErr.field},  Object: ${fErr.objectName}, message: ${fErr.message}\n`;
    });
  }
  return message;
};

export default () => next => action => {
  /**
   *
   * The error middleware serves to log error messages from dispatch
   * It need not run in production
   */
  if (DEVELOPMENT) {
    const { error } = action;
    if (error) {
      // Profile fetch often fails with "Network Error" when backend is not running — skip noisy log
      const isProfileNetworkError = action.type === 'applicationProfile/get_profile/rejected' && error.message === 'Network Error';
      if (!isProfileNetworkError) {
        console.error(`${action.type} caught at middleware with reason: ${JSON.stringify(error.message)}.`);
        if (error.response && error.response.data) {
          const message = getErrorMessage(error.response.data);
          console.error(`Actual cause: ${message}`);
        }
      }
    }
  }
  // Dispatch initial action
  return next(action);
};
