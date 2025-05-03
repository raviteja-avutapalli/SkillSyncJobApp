from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import random
import string
import time

def generate_random_email():
    return "admin" + ''.join(random.choices(string.ascii_lowercase + string.digits, k=5)) + "@gmail.com"

driver = webdriver.Edge()
driver.get("http://localhost:5173/register")
driver.maximize_window()
wait = WebDriverWait(driver, 20)

admin_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[.//span[text()='Admin']]")))
admin_button.click()

continue_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Continue')]")))
continue_button.click()

random_email = generate_random_email()
password = "Adminpass123"

wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Full Name']"))).send_keys("admin user")
driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys(random_email)
driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys(password)
driver.find_element(By.XPATH, "//input[@type='checkbox']").click()
driver.find_element(By.XPATH, "//button[contains(., 'Register')]").click()

wait.until(EC.url_contains("/login"))
print("✅ Admin registered successfully, redirected to login.")


wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='you@example.com']"))).send_keys(random_email)
driver.find_element(By.XPATH, "//input[@placeholder='••••••••']").send_keys(password)
driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()

wait.until(EC.url_contains("/dashboard/admin"))
print("🎉 Admin login successful. Redirected to Admin Dashboard.")


time.sleep(3)
driver.quit()
