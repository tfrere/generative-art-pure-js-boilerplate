# install

brew install python3 cairo libxml2 libxslt libffi\n
conda create --name cairo_env python=3.9\n
conda create --name sanskrit-letters python=3.9\n
conda activate sanskrit-letters
conda install -c conda-forge cairosvg
pip install svgwrite

# use

sh create-masks.py
