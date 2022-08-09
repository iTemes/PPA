const API_URL = "/expand_settings/api/saver_configurator/";

export const saveConfigurator = async (data) => {
  try {
    const result = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams(data),
      credentials: "include",
    });

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
