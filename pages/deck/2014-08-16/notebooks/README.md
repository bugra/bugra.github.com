### Conda Installation and Python 3.4 Environment
- First Install Conda: https://store.continuum.io/cshop/anaconda/
- Then create a python 3.4 environment using the following two commands
- If you are using python 3.4, you may still want to create a separate environment 
to be able to run the notebooks standalone and protect your system from 
the side effects(there should not be any) that the following packages may cause
```
conda create -n py34 python=3.4 anaconda
source activate py34
```

- First install pip if you do not have it already: http://pip.readthedocs.org/en/latest/installing.html
- Then install the following packages:

```
pip install pyquery
pip install requests
```

- The following packages are not necessary for notebooks, but if you want to 
try the code that is in the slides you may want to install it

```
pip install selenium
pip install splinter
```
- For Mac users, if you do not have brew: http://brew.sh/
- Install phantomjs using the following command
```
brew update && brew install phantomjs
```
- Phantomjs provides its binaries for most of the operating systems in [here](http://phantomjs.org/download.html)

