from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random
import string

def generate_random_email():
    return "auto" + ''.join(random.choices(string.ascii_lowercase + string.digits, k=5)) + "@gmail.com"

driver = webdriver.Edge()
driver.get("http://localhost:5173/register")
driver.maximize_window()
wait = WebDriverWait(driver, 20)

jobseeker_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[.//span[text()='Jobseeker']]")))
jobseeker_button.click()

continue_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Continue')]")))
continue_button.click()

random_email = generate_random_email()
password = "Autopass123"

name_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Full Name']")))
name_input.send_keys("auto")

email_input = driver.find_element(By.XPATH, "//input[@placeholder='Email']")
email_input.send_keys(random_email)

password_input = driver.find_element(By.XPATH, "//input[@placeholder='Password']")
password_input.send_keys(password)

checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
checkbox.click()

register_button = driver.find_element(By.XPATH, "//button[contains(., 'Register')]")
register_button.click()

wait.until(EC.url_contains("/login"))
print("✅ Registration complete and redirected to login page")

email_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='you@example.com']")))
email_field.send_keys(random_email)

password_field = driver.find_element(By.XPATH, "//input[@placeholder='••••••••']")
password_field.send_keys(password)

login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
login_button.click()

wait.until(EC.url_contains("/dashboard/jobseeker"))
print("🎉 Login successful. Redirected to jobseeker dashboard.")

try:
    recommended_job_card = wait.until(EC.presence_of_element_located((By.XPATH, "//h2[text()='Recommended Jobs']/following::div[contains(@class, 'cursor-pointer')][1]")))
    recommended_job_card.click()
    print("🔍 Opened a recommended job modal.")

    apply_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Apply')]")))
    apply_button.click()
    print("📄 Navigated to job recommendations via Apply.")

except Exception as e:
    driver.save_screenshot("job_access_failed.png")
    raise AssertionError(f"❌ Job access failed: {e}")

finally:
    driver.quit()
