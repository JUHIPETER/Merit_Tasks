import selenium
from selenium import webdriver
import pandas as pd
from pandas import ExcelWriter
from pandas import ExcelFile
from selenium.webdriver.support.ui import Select
import time
import  os

driverPath = r"C:\Users\Merit\PycharmProjects\chrome\chromedriver_win32 (1)\chromedriver.exe"
driver = webdriver.Chrome(executable_path = driverPath)
driver.get("https://www.amazon.in/s?k=offer+bluetooth+speaker&crid=9GV6OJRK04C&sprefix=offer+bluetooth+s%2Caps%2C333&ref=nb_sb_ss_ts-doa-p_1_17")
print(driver.title)
print(driver.current_url)
driver.maximize_window()

count_of_divs = len(driver.find_elements_by_xpath("//body/div[@id='a-page']/div[@id='search']/div[1]/div[1]/div[1]/span[3]/div[2]/div"))

count_of_divs-=3

name=[]
price=[]
markedprice=[]
for i in range(2,count_of_divs):
    div1=driver.find_element_by_xpath("//body/div[@id='a-page']/div[@id='search']/div[1]/div[1]/div[1]/span[3]/div[2]/div[%d]" %(i))
    n=div1.find_element_by_class_name("a-text-normal").text
    name.append(n)
    p=div1.find_element_by_class_name("a-price").text
    price.append(p)
    mrp=div1.find_element_by_class_name("a-text-price").text
    markedprice.append(mrp)

df=pd.DataFrame({"Name":name,"Price":price,"MarkedPrice":markedprice})
writer =pd.ExcelWriter("amazon.xlsx", engine="xlsxwriter")
df.to_excel(writer,'Sheet1',index=False)
writer.save()
driver.close()
