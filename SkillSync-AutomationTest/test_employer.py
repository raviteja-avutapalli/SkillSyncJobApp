from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import random
import string
import time

def generate_random_email():
    return "emp" + ''.join(random.choices(string.ascii_lowercase + string.digits, k=5)) + "@gmail.com"

email = generate_random_email()
password = "EmpTest123"

driver = webdriver.Edge()
driver.get("http://localhost:5173/register")
driver.maximize_window()
wait = WebDriverWait(driver, 20)

employer_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[.//span[text()='Employer']]")))
employer_button.click()

continue_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Continue')]")))
continue_button.click()

wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Full Name']"))).send_keys("Employer User")
driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys(email)
driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys(password)
driver.find_element(By.XPATH, "//input[@type='checkbox']").click()
driver.find_element(By.XPATH, "//button[contains(text(), 'Register')]").click()

wait.until(EC.url_contains("/login"))
print("✅ Registration complete and redirected to login page")

wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='you@example.com']"))).send_keys(email)
driver.find_element(By.XPATH, "//input[@placeholder='••••••••']").send_keys(password)
driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()

wait.until(EC.url_contains("/dashboard/employer"))
print("🎉 Login successful. Redirected to employer dashboard.")

try:
    recent_apps_heading = wait.until(EC.presence_of_element_located((By.XPATH, "//h2[contains(text(),'Recent Applications')]")))
    driver.execute_script("arguments[0].scrollIntoView(true);", recent_apps_heading)
    print("📂 Scrolled to 'Recent Applications' section.")
    time.sleep(3)
except Exception as e:
    raise AssertionError(f"❌ Could not reach 'Recent Applications': {e}")

driver.quit()
