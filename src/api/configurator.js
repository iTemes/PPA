const API_URL = "/expand_settings/api/saver_tester/";

export const saveConfigurator = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

export const sendEmailConfig = async (targetEmail, configKey, result) => {
  const putEmailObject = {
    target_email: targetEmail,
    config_key: configKey,
    object_configurator: result,
  };

  try {
    fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(putEmailObject),
      credentials: "include",
    });
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
