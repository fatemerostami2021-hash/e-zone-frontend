echo ---FXCSS-150-245
sed -n '150,245p' src/pages/HomePage.fx.css
echo ---HOMECSS-567-600
sed -n '567,600p' src/pages/HomePage.css
echo ---HOMECSS-740-795
sed -n '740,795p' src/pages/HomePage.css
echo ---HOMECSS-1485-1520
sed -n '1485,1520p' src/pages/HomePage.css
echo ---SPLIT
grep -rn "SplitText\|ezh-w" src | head
echo ---MEDIA
ls -la public/image/import-export-process.webp
for f in public/video/hero-home.mp4 public/video/hero-home-banner.mp4 public/image/import-export-process.webp; do
  echo $f
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 "$f"
done
